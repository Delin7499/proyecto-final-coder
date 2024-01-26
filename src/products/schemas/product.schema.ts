import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({
    required: true,
  })
  title: String;

  @Prop({ required: true })
  description: String;

  @Prop({ required: true, unique: true })
  code: String;

  @Prop({ required: true })
  price: Number;

  @Prop({ required: true })
  status: Boolean;

  @Prop({ required: true })
  stock: Number;

  @Prop({
    default: `Product`,
  })
  category: string;

  @Prop({ default: 'https://via.placeholder.com/150' })
  thumbnail: String;

  @Prop({ required: true, default: 'admin' })
  owner: String;

  @Prop({ default: '000000000000' })
  barcode: String;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
