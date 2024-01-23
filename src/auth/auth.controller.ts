import {
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  UseFilters,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NotLoggedInGuard } from './notloggedin.guard';
import { LoginDto } from './DTO/login.dto';
import { CreateUserDto } from 'src/users/DTO/create-user.dto';
import { InvalidCredentialsExceptionFilter } from './invalidCredentials.filter';
import { Response, response } from 'express';
import { InvalidRegistrationExceptionFilter } from './invalidRegistration.filter';
import { request } from 'http';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseFilters(InvalidCredentialsExceptionFilter)
  @Post('login')
  @UseGuards(NotLoggedInGuard)
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
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
      throw new BadRequestException('Invalid email or password');
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

      return await this.authService.register(registerDto);
    } catch (err) {
      throw new BadRequestException('Registration failed');
    }
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return response.redirect('/login');
  }
}
