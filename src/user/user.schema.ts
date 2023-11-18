import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCK = 'BLOCK',
  VERIFYING = 'VERIFYING',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true, collection: 'user' })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: false, nullable: true })
  phone?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  code: string;

  @Prop({ type: String, default: UserRole.USER, enum: UserRole })
  role?: UserRole;

  @Prop({ required: false })
  name?: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.VERIFYING })
  status?: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
