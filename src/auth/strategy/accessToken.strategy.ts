import { UserService } from '@apps/api/user/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserAuth } from '../auth.interface';
import { checkUserStatus } from './checkUserStatus';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService
        .get<string>('jwt.access_token.public_key')
        .replace(/\\n/g, '\n'),
      algorithms: ['RS512'],
    });
  }

  async validate(payload: IUserAuth) {
    const user = await this.userService.getUserByUserId(payload.userId);
    checkUserStatus(user);
    return {
      userId: payload.userId,
      role: payload.role,
    };
  }
}
