import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tag } from '../tag/tag.schema';
import { User } from '../user/user.schema';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ timestamps: true, collection: 'groups' })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: false, nullable: true })
  avatar: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
  tags: Tag;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
