import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  status: boolean;

  @Prop({ required: true })
  stock: number;

  @Prop({
    default: `Product`,
  })
  category: string;

  @Prop({ default: 'https://via.placeholder.com/150' })
  thumbnail: string;

  @Prop({ required: true, default: 'admin' })
  owner: string;

  @Prop({ default: '000000000000' })
  barcode: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
