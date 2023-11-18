import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class I18n {
  @Prop({ required: false })
  en: string;
  @Prop({ required: false })
  vi: string;
}
