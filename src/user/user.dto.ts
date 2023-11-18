import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    type: String,
    example: 'test@gmail.com',
  })
  @IsOptional()
  @IsString()
  readonly email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly name?: string;
}
