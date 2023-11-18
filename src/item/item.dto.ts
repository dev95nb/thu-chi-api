import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PagingDto } from '../base/paging.dto';
import { Currency } from '../const/common';
import { TransactionType } from './item.schema';

export class GetListItemDto extends PickType(PagingDto, [
  'cursor',
  'limit',
] as const) {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateItemDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @ApiProperty({
    enum: TransactionType,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  readonly transactionType: TransactionType;

  @ApiProperty({
    enum: Currency,
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  readonly currency: Currency;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @MaxLength(255)
  readonly note: string;
}
