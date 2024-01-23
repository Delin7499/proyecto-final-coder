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

const storage = diskStorage({
  destination: './public/assets/images',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${name}-${randomName}${extension}`);
  },
});

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
}
