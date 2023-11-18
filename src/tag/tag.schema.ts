import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true, collection: 'tags' })
export class Tag {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false, nullable: true })
  avatar: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
