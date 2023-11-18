import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ITokenData } from '../auth/auth.interface';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: 'lang',
    description: 'Display language',
  })
  @Get('me')
  async getUserDetail(@Req() req: { user: ITokenData }) {
    const { userId } = req.user;
    const token = await this.userService.getUserDetail(userId);
    return token;
  }
}
