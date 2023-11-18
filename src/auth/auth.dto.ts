import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthProvider } from '../const/common';

export class LoginUserDto {
  @ApiProperty({
    type: String,
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({
    type: String,
    example: '+8412345678',
  })
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ApiProperty({
    type: String,
    example: 'test12345',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class SignUpUserDto extends PickType(LoginUserDto, [
  'email',
  'password',
] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

export class GetLoginOptionsDto extends PickType(LoginUserDto, [
  'email',
  'phone',
] as const) {}

export class VerifyCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly code: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}

export class CheckAuthBySocialDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  readonly provider: AuthProvider;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly socialId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
