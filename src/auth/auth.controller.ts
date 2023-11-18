import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CheckAuthBySocialDto,
  GetLoginOptionsDto,
  LoginUserDto,
  SignUpUserDto,
  VerifyCodeDto,
} from './auth.dto';
import { RefreshJwtAuthGuard } from './auth.guard';
import { ITokenData } from './auth.interface';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-auth-by-social')
  checkAuthBySocial(@Body() body: CheckAuthBySocialDto) {
    return this.authService.checkAuthBySocial(body);
  }

  @Post('get-login-options')
  getLoginOptions(@Body() body: GetLoginOptionsDto) {
    return this.authService.getLoginOptions(body);
  }

  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }

  @Post('signup')
  signUp(@Body() body: SignUpUserDto) {
    return this.authService.signUp(body);
  }

  @Post('verify-code')
  verifyCode(@Body() body: VerifyCodeDto) {
    return this.authService.verifyCode(body);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  @Post('renew')
  async renewAccessToken(@Req() req: { user: ITokenData }) {
    const { userId } = req.user;
    const token = await this.authService.renewAccessToken(userId);
    return token;
  }
}
