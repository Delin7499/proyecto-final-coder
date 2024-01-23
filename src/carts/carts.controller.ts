import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { ProductsService } from 'src/products/products.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('api/carts')
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly productService: ProductsService,
  ) {}
  @Get()
  async findAll() {
    return this.cartsService.findAll();
  }

  @Get('cart/:id')
  async findOne(@Param('id') id: string) {
    return this.cartsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.cartsService.update(id, data);
  }

  @Post(':cid/product/:pid')
  @UseGuards(AuthGuard('jwt'))
  async addProduct(
    @Res() response: Response,
    @Param('cid') cid: string,
    @Param('pid') pid: string,
    @Body() body: any,
  ) {
    const cart = await this.cartsService.findById(cid);

    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' });
    }

    const productToAdd = await this.productService.findById(pid);
    if (!productToAdd) {
      return response.status(404).json({ message: 'Product not found' });
    }

    const cartProduct = cart.products.find((p) => p.product.toString() == pid);

    const quantity = parseInt(body.quantity);
    if (cartProduct) {
      cartProduct.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    const update = await this.cartsService.update(cid, cart);
    return response.status(201).json(update);
  }

  @Get('my-cart')
  @UseGuards(AuthGuard('jwt'))
  async getMyCart(@Req() request: Request, @Res() response: Response) {
    const user = request.user['user'];
    const cart = await this.cartsService.findByIdPopulated(user.cart);
    return response.json(cart);
  }

  @Delete(':cid/product/:pid')
  @UseGuards(AuthGuard('jwt'))
  async removeProduct(
    @Res() response: Response,
    @Param('cid') cid: string,
    @Param('pid') pid: string,
  ) {
    const cart = await this.cartsService.findById(cid);
    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' });
    }

    const index = cart.products.findIndex(
      (product) => product.product.toString() === pid,
    );
    if (index !== -1) {
      cart.products.splice(index, 1);
    } else {
      return response
        .status(404)
        .json({ message: 'Product not found in cart' });
    }
    const update = await this.cartsService.update(cid, cart);
    return response.status(201).json(update);
  }
}
