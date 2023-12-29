import { Module } from '@nestjs/common';
import { Cart, CartSchema } from './schemas/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule,
  ],
  providers: [CartsService],
  controllers: [CartsController],
  exports: [CartsService],
})
export class CartsModule {}
