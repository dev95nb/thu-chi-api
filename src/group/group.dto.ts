import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PagingDto } from '../base/paging.dto';

export class GetListGroupDto extends PickType(PagingDto, [
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

export class CreateGroupDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
