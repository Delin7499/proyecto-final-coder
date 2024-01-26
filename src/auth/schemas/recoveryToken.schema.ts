import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecoveryTokenDocument = HydratedDocument<RecoveryToken>;

@Schema()
export class RecoveryToken {
  @Prop({
    required: true,
  })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ default: Date.now, expires: 3600 })
  createdAt: Date;
}

export const RecoveryTokenSchema = SchemaFactory.createForClass(RecoveryToken);
