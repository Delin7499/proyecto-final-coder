import {
  Controller,
  Get,
  Param,
  Res,
  Req,
  UseGuards,
  UseFilters,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';
import { NotLoggedInGuard } from './auth/notloggedin.guard';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorizedException.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('login')
  login(@Req() request: Request, @Res() response: Response) {
    return response.render('login');
  }

  @Get('signup')
  signup(@Req() request: Request, @Res() response: Response) {
    if (request.user) {
      return response.redirect('/home');
    }
    return response.render('signup');
  }

  @Get('password-recover')
  passwordRecover(@Req() request: Request, @Res() response: Response) {
    if (request.user) {
      return response.redirect('/home');
    }
    return response.render('passwordRecovery');
  }

  @Get('password-reset/:email/:token')
  passwordReset(
    @Req() request: Request,
    @Res() response: Response,
    @Param('email') email: string,
    @Param('token') token: string,
  ) {
    if (request.user) {
      return response.redirect('/home');
    }
    return response.render('resetPassword', { email, token });
  }

  @Get('home')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  home(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    return response.render('home', { user });
  }

  @Get('profile')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  profile(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    if (!user) {
      return response.redirect('/login');
    }
    const profileDocument = user.documents.find(
      (doc) => doc.name === 'ProfilePicture',
    );
    const profilePicture = profileDocument ? profileDocument.reference : null;

    return response.render('profile', { user, profilePicture });
  }

  @Get('edit-profile')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  editProfile(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    if (!user) {
      return response.redirect('/login');
    }
    const profileDocument = user.documents.find(
      (doc) => doc.name === 'ProfilePicture',
    );
    const profilePicture = profileDocument ? profileDocument.reference : null;

    return response.render('editProfile', { user, profilePicture });
  }

  @Get('carts/:cid')
  cart(@Res() response: Response, @Param('cid') cid: string) {
    const cartId = cid;
    if (false) {
      return response.redirect('/login');
    }
    return response.render('cart', { cartId });
  }

  @Get('mycart')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  mycart(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    return response.render('cart', { user, cartId: user.cart });
  }

  @Get('mytickets')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  mytickets(@Res() response: Response) {
    if (false) {
      return response.redirect('/login');
    }
    return response.render('userTickets');
  }

  @Get('realtimeproducts')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  realtimeproducts(@Res() response: Response) {
    if (false) {
      return response.redirect('/login');
    }
    return response.render('realTimeProducts');
  }

  @Get('product/:pid')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  product(
    @Req() request: Request,
    @Res() response: Response,
    @Param('pid') pid: string,
  ) {
    const user = request.user['user'];
    const cartId = user.cart;
    return response.render('productPage', { pid, cartId });
  }

  @Get('chat')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  chat(@Res() response: Response) {
    if (false) {
      return response.redirect('/login');
    }
    return response.render('chat');
  }
}
