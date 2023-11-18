import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { LanguageCode } from '../const/common';

export class HeaderDto {
  @ApiProperty({
    example: LanguageCode.Viet_Nam,
    default: LanguageCode.Viet_Nam,
  })
  @IsEnum(LanguageCode)
  @IsOptional()
  lang: LanguageCode;
}
