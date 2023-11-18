import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PagingDto } from '../base/paging.dto';

export class CreateTagDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly avatar: string;
}

export class GetListTagDto extends PickType(PagingDto, [
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
