import { UserService } from '@apps/api/user/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserAuth } from '../auth.interface';
import { checkUserStatus } from './checkUserStatus';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService
        .get<string>('jwt.refresh_token.public_key')
        .replace(/\\n/g, '\n'),
      passReqToCallback: true,
      algorithms: ['RS512'],
    });
  }

  async validate(req: Request, payload: IUserAuth) {
    const refreshToken = req
      .get('Authorization')
      ?.replace('Bearer', '')
      ?.trim();
    const user = await this.userService.getUserByUserId(payload.userId);
    checkUserStatus(user);
    return { userId: payload.userId, refreshToken };
  }
}
