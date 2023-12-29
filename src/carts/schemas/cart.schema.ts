import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema()
export class ProductItem {
  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product: string;
}

const ProductItemSchema = SchemaFactory.createForClass(ProductItem);

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop({
    type: [ProductItemSchema],
    default: [],
  })
  products: ProductItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
