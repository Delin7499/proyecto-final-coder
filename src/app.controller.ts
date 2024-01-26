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
    @Res() response: Response,
    @Param('email') email: string,
    @Param('token') token: string,
  ) {
    return response.render('resetPassword', { email, token });
  }

  @Get('home')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  home(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    const isAdmin = user.role === 'Admin' || user.role === 'Premium';
    return response.render('home', { user, isAdmin });
  }

  @Get('profile')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  profile(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];

    const isAdmin = user.role === 'Admin' || user.role === 'Premium';

    return response.render('profile', { user, isAdmin });
  }

  @Get('edit-profile')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  editProfile(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    const isAdmin = user.role === 'Admin' || user.role === 'Premium';

    return response.render('editProfile', { user, isAdmin });
  }
  @Get('carts/:cid')
  cart(@Res() response: Response, @Param('cid') cid: string) {
    const cartId = cid;

    return response.render('cart', { cartId });
  }

  @Get('mycart')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  mycart(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    const isAdmin = user.role === 'Admin' || user.role === 'Premium';
    return response.render('cart', { user, cartId: user.cart, isAdmin });
  }

  @Get('mytickets')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  mytickets(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    const userEmail = user.email;
    const isAdmin = user.role === 'Admin' || user.role === 'Premium';
    return response.render('userTickets', { user, userEmail, isAdmin });
  }

  @Get('realtimeproducts')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  realtimeproducts(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    const userEmail = user.email;
    const isAdmin = user.role === 'Admin' || user.role === 'Premium';
    return response.render('realTimeProducts', { user, userEmail, isAdmin });
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
    const isAdmin = user.role === 'Admin' || user.role === 'Premium';
    return response.render('productPage', { user, pid, cartId, isAdmin });
  }

  @Get('chat')
  @UseFilters(UnauthorizedExceptionFilter)
  @UseGuards(AuthGuard('jwt'))
  chat(@Res() response: Response) {
    return response.render('chat');
  }
}
