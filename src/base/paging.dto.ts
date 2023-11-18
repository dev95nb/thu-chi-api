import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PagingDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  cursor: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  limit: number;
}
