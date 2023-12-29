import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({
    required: true,
  })
  name: String;

  @Prop({ required: true })
  thumbnail: String;

  @Prop({ required: true, default: 'admin' })
  owner: String;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
