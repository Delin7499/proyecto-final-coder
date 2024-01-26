import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
  })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['Premium', 'Admin', 'User'], default: 'User' })
  role: string;

  @Prop({ default: false })
  isGithub: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Cart' })
  cart: string;

  @Prop({ default: [], ref: 'Ticket' })
  tickets: [Types.ObjectId];

  @Prop({
    default: [
      {
        name: 'ProfilePicture',
        reference: './profiles/default/default.jpeg',
      },
    ],
  })
  documents: [{ name: string; reference: string }];

  @Prop()
  lastConnection: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
