import {
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  UseFilters,
  Res,
  Req,
  Param,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NotLoggedInGuard } from './notloggedin.guard';
import { LoginDto } from './DTO/login.dto';
import { CreateUserDto } from 'src/users/DTO/create-user.dto';
import { InvalidCredentialsExceptionFilter } from './invalidCredentials.filter';
import { Response, Request } from 'express';
import { InvalidRegistrationExceptionFilter } from './invalidRegistration.filter';
import { get, request } from 'http';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @UseFilters(InvalidCredentialsExceptionFilter)
  @Post('login')
  @UseGuards(NotLoggedInGuard)
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    if (
      loginDto.email == process.env.ADMIN_NAME &&
      loginDto.password == process.env.ADMIN_PASSWORD
    ) {
      const user = {
        first_name: 'Admin',
        last_name: 'Admin',
        email: 'Admin',
        age: 18,
        role: 'Admin',
        isGithub: false,
        cart: '',
        tickets: [],
        documents: [
          {
            name: 'ProfilePicture',
            reference: './profiles/default/default.jpeg',
          },
        ],
        lastConnection: new Date(),
      };

      const jwt = await this.authService.login(user);
      response.cookie('jwt', jwt, { httpOnly: true });
      return response.redirect('/home');
    }

    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }
      const jwt = await this.authService.login(user);
      response.cookie('jwt', jwt, { httpOnly: true });
      response.redirect('/home');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('register')
  @UseFilters(InvalidRegistrationExceptionFilter)
  @UseGuards(NotLoggedInGuard)
  async register(
    @Res() response: Response,
    @Body() registerDto: CreateUserDto,
  ) {
    try {
      const newUser = await this.authService.register(registerDto);
      const jwt = await this.authService.login(newUser);
      response.cookie('jwt', jwt, { httpOnly: true });
      response.redirect('/home');

      return { message: 'Registration successful' };
    } catch (err) {
      throw new BadRequestException('Registration failed');
    }
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Res() response: Response, @Req() request: Request) {
    const email = request.user['user']?.email;
    let user: any;
    try {
      user = await this.usersService.findByEmail(email);
    } catch (err) {
      const newUser = {
        first_name: request.user['user'].first_name,
        last_name: 'Github User',
        email: email,
        password: '',
        age: 18,
        role: 'User',
        isGithub: true,
      };
      user = await this.authService.register(newUser);
    }

    const jwt = await this.authService.login(user);
    response.cookie('jwt', jwt, { httpOnly: true });
    response.redirect('/home');

    return { message: 'Github login successful' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return response.redirect('/login');
  }

  @Post('forgot-password')
  async forgotPassword(@Req() request: Request, @Body() body: any) {
    console.log(request.headers.host);
    console.log('email ', body.email);
    const email = body.email;
    if (await this.authService.userExists(email)) {
      const token = await this.authService.createRecoveryToken(email, uuidv4());
      const url = `${request.headers.host}/password-reset/${email}/${token.token}`;
      const html = `<h1>Reset your password</h1><p>Click <a href="${url}">here</a> to reset your password</p>`;
      console.log('html ', html);
      await this.mailService.send(email, 'Reset your password', html);
      return { message: 'Email sent' };
    } else {
      return { message: 'User does not exist' };
    }
  }

  @Post('reset-password/:email/:token')
  async resetPassword(
    @Param('email') email,
    @Param('token') token,
    @Body() body,
    @Res() res: Response,
  ) {
    const password = body.password;
    const user = await this.usersService.findByEmail(email);
    if (!password) {
      return res.status(400).send({ message: 'Password is required' });
    }
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    if (user.isGithub) {
      return res.status(401).send({
        message: "You can't change your password because you are a Github user",
      });
    }

    const recoveryToken = await this.authService.findRecoveryToken(
      email,
      token,
    );

    if (!recoveryToken) {
      return res.status(404).send({ message: 'Invalid or expired token' });
    }
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    user.password = hashedPassword;

    await this.usersService.updateByEmail(email, user);

    await this.authService.deleteRecoveryToken(recoveryToken._id);

    return res.status(200).send('Password updated');
  }
}
