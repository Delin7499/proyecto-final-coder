import {
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from 'src/users/users.service';
import { existsSync, mkdirSync } from 'fs';

const documentsStorage = diskStorage({
  destination: (req: Request, file, cb) => {
    const user = req.user['user'];
    const userId = user._id;
    const userName = user.first_name.replace(/ /g, '_');

    const path = `./public/documents/${userName}-${userId}`;
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
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

const productsStorage = diskStorage({
  destination: (req: Request, file, cb) => {
    const user = req.user['user'];
    const userId = user._id;
    const userName = user.first_name.replace(/ /g, '_');

    const path = `./public/products/${userName}-${userId}`;
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
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

const profilesStorage = diskStorage({
  destination: (req: Request, file, cb) => {
    const user = req.user['user'];
    const userId = user._id;
    const userName = user.first_name.replace(/ /g, '_');

    const path = `./public/profiles/${userName}-${userId}`;
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
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

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly usersService: UsersService) {}

  @Post('proof-of-address')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { storage: documentsStorage }))
  async uploadProofOfAdress(
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const loggedUser = request.user['user'];

    const id = loggedUser._id;

    const user = await this.usersService.findById(id);

    const filePath = file.path.replace('public', '');
    user.documents.push({ name: 'ProofOfAddress', reference: filePath });
    this.usersService.update(id, user);
    return response.redirect('/profile');
  }

  @Post('account-status')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { storage: documentsStorage }))
  async uploadAccountStatus(
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const loggedUser = request.user['user'];

    const id = loggedUser._id;

    const user = await this.usersService.findById(id);
    const filePath = file.path.replace('public', '');
    user.documents.push({ name: 'AccountStatus', reference: filePath });
    this.usersService.update(id, user);
    return response.redirect('/profile');
  }

  @Post('profile-picture')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { storage: profilesStorage }))
  async uploadProfilePicture(
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const loggedUser = request.user['user'];

    const id = loggedUser._id;

    const user = await this.usersService.findById(id);
    const filePath = file.path.replace('public', '');

    const existingProfilePicture = user.documents.find(
      (doc) => doc.name === 'ProfilePicture',
    );

    // Delete the old file if it exists
    if (existingProfilePicture) {
      existingProfilePicture.reference = filePath;
    } else {
      user.documents.push({ name: 'ProfilePicture', reference: filePath });
    }
    this.usersService.update(id, user);
    return response.redirect('/profile');
  }
}
