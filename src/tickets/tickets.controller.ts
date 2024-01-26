import { Controller, Req, Res, UseGuards, Get, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CartsService } from 'src/carts/carts.service';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';

@Controller('api/tickets')
export class TicketsController {
  constructor(
    private readonly ticketService: TicketsService,
    private readonly cartsService: CartsService,
    private readonly userService: UsersService,
    private readonly productsService: ProductsService,
  ) {}
  //ticketRouter.post("/:cartId/purchase", purchase);
  //ticketRouter.get("/user/:email", getUserTickets);
  processPurchase = async (cart) => {
    const updatedProducts = await Promise.all(
      cart.products.map(async (cartProduct) => {
        const { product, quantity } = cartProduct;

        const availableStock = product.stock;

        if (availableStock >= quantity) {
          product.stock -= quantity;
          await this.productsService.update(product._id, product);
          return { ...cartProduct, purchased: true };
        } else {
          return { ...cartProduct, purchased: false };
        }
      }),
    );

    const notPurchasedProducts = updatedProducts
      .filter((cartProduct) => !cartProduct.purchased)
      .map((cartProduct) => {
        return {
          quantity: cartProduct.quantity,
          product: cartProduct.product._id.toString(),
          _id: cartProduct._id,
        };
      });

    const updatedCart = await this.cartsService.update(cart._id, {
      products: notPurchasedProducts,
    });

    const purchasedProducts = updatedProducts.filter(
      (cartProduct) => cartProduct.purchased,
    );

    updatedCart.products = purchasedProducts;

    return updatedCart;
  };

  @Post(':cartId/purchase')
  @UseGuards(AuthGuard('jwt'))
  async purchase(@Req() req: Request, @Res() res: Response) {
    const cartId = req.params.cartId;

    try {
      const cart = await this.cartsService.findByIdPopulated(cartId);
      console.log(cart);
      const email = req.user['user'].email;
      const userId = req.user['user']._id;

      if (!cart) {
        return res.status(404).send("Cart doesn't exist");
      }

      const updatedCart = await this.processPurchase(cart);
      const totalAmount = updatedCart.products.reduce((total, product) => {
        return total + product.quantity * product.product['price'];
      }, 0);

      const newTicket = await this.ticketService.create({
        amount: totalAmount,
        purchaser: email,
      });

      this.userService.addTicket(userId, newTicket._id);

      res.status(200).json({
        message: 'Purchase complete',
        purchasedProducts: updatedCart.products,
      });
    } catch (error) {
      console.error('Error processing purchase:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  @Get('/user/:email')
  async getUserTickets(@Req() req: Request, @Res() res: Response) {
    const userEmail = req.params.email;

    const user = await this.userService.findByEmailPopulated(userEmail);
    return res.status(200).send(user.tickets);
  }
}
