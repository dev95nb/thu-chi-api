import { IsOptional, IsString } from 'class-validator';

export class I18nDto {
  @IsString()
  en: string;

  @IsString()
  @IsOptional()
  vi?: string;
}
