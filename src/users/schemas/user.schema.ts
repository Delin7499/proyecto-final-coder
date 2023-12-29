import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
  })
  first_name: String;

  @Prop({ required: true })
  last_name: String;

  @Prop({ required: true, unique: true })
  email: String;

  @Prop({ required: true })
  age: Number;

  @Prop({ required: true })
  password: String;

  @Prop({ required: true, enum: ['Premium', 'Admin', 'User'], default: 'User' })
  role: String;

  @Prop({ required: true })
  isGithub: Boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Cart' })
  cart: String;

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Ticket' })
  tickets: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
