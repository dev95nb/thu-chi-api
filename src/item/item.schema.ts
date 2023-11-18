import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Currency } from '../const/common';
import { Tag } from '../tag/tag.schema';
import { User } from '../user/user.schema';

export type ItemDocument = HydratedDocument<Item>;

export enum TransactionType {
  OUTCOME = 'OUTCOME',
  INCOME = 'INCOME',
}

@Schema({ timestamps: true, collection: 'items' })
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: Currency, type: String })
  currency: Currency;

  @Prop({ required: true })
  transactionType: TransactionType;

  @Prop({ required: false, nullable: true })
  note: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' })
  tag: Tag;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
