import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema()
export class Ticket {
  @Prop({ required: true, unique: true })
  code: String;

  @Prop({ required: true, default: Date.now() })
  purchase_date: Date;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ required: true })
  purchaser: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
