import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  Query,
  Res,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { ProductsService } from 'src/products/products.service';
import { Response } from 'express';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cartsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.cartsService.update(id, data);
  }

  @Post(':cid/product/:pid')
  async addProduct(
    @Res() response: Response,
    @Param('cid') cid: string,
    @Param('pid') pid: string,
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

    if (cartProduct) {
      cartProduct.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    const update = await this.cartsService.update(cid, cart);
    return response.status(201).json(update);
  }
}
