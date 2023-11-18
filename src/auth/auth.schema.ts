import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ collection: 'auth' })
export class Auth {
  @Prop()
  userId: string;

  @Prop()
  refreshToken: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
