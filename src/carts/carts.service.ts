import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private productService: ProductsService,
  ) {}

  async create(): Promise<CartDocument> {
    const newCart = new this.cartModel();
    return newCart.save();
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  async findById(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id).exec();
    if (!cart) {
      throw new Error(`Cart with id ${id} not found`);
    }
    return cart;
  }
  async findOne(data: any): Promise<Cart> {
    const cart = await this.cartModel.findOne(data).exec();
    if (!cart) {
      throw new Error(`Cart not found`);
    }
    return cart;
  }

  async update(id: string, data: any): Promise<Cart> {
    const cart = await this.cartModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!cart) {
      throw new Error(`Cart with id ${id} not found`);
    }
    return cart;
  }

  async addProduct(cartId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }
    const productToAdd = await this.productService.findById(productId);

    if (!productToAdd) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
    const cartProduct = cart.products.find(
      (p) => p.product.toString() === productId,
    );
    if (cartProduct) {
      cartProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    return cart.save();
  }
}
