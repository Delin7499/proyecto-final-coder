import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('edit')
  @UseGuards(AuthGuard('jwt'))
  async editUser(@Req() request: Request, @Res() response: Response) {
    const loggedUser = request.user['user'];

    const id = loggedUser._id;

    const user = await this.usersService.findById(id);
    user.first_name = request.body.first_name;
    user.last_name = request.body.last_name;
    this.usersService.update(id, user);
    return response.redirect('/profile');
  }
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() request: Request, @Res() response: Response) {
    const loggedUser = request.user['user'];

    const id = loggedUser._id;

    const user = await this.usersService.findById(id);
    const { password, ...result } = user;
    return response.json(result);
  }

  @Post('premium/:uid')
  async makePremium(@Req() request: Request, @Res() response: Response) {
    const id = request.params.uid;
    const user = await this.usersService.findById(id);
    if (!user) return response.status(404).json({ message: 'User not found' });

    const documents = user.documents;

    const profilePic = documents.find((doc) => doc.name === 'ProfilePicture');
    const accountSatatus = documents.find(
      (doc) => doc.name === 'AccountStatus',
    );
    const proofOfAddress = documents.find(
      (doc) => doc.name === 'ProofOfAddress',
    );

    if (!profilePic)
      return response
        .status(404)
        .json({ message: 'Profile picture not found' });
    if (!accountSatatus)
      return response.status(404).json({ message: 'Account status not found' });
    if (!proofOfAddress)
      return response
        .status(404)
        .json({ message: 'Proof of address not found' });

    user.role = 'Premium';
    this.usersService.update(id, user);

    return response.redirect('/home');
  }
}
