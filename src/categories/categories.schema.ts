import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type CategoriesDocument = HydratedDocument<Categories>;

@Schema({ timestamps: true, collection: 'tags' })
export class Categories {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false, nullable: true })
  avatar: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
