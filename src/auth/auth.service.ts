import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, hashSync } from 'bcrypt';
import { constants, privateDecrypt, publicEncrypt } from 'crypto';
import { Model } from 'mongoose';
import { ErrorCode } from '../const/common';
import { EmailService } from '../email/email.service';
import { UserDocument, UserStatus } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { generateRandomNumber } from '../utils/common';
import { resError } from '../utils/error';
import {
  CheckAuthBySocialDto,
  GetLoginOptionsDto,
  LoginUserDto,
  SignUpUserDto,
  VerifyCodeDto,
} from './auth.dto';
import { Auth } from './auth.schema';
import { checkUserStatus } from './strategy/checkUserStatus';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly privateKey: string;
  private readonly verifyCodePrivateKey: string;
  private readonly verifyCodePublicKey: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private emailService: EmailService,
    @InjectModel(Auth.name) private authModel: Model<Auth>,
  ) {
    this.privateKey = this.configService.get<string>(
      'jwt.access_token.private_key',
    );

    this.verifyCodePrivateKey = this.configService.get<string>(
      'jwt.verify_code.private_key',
    );

    this.verifyCodePublicKey = this.configService.get<string>(
      'jwt.verify_code.public_key',
    );
  }

  async checkAuthBySocial(body: CheckAuthBySocialDto) {
    return body;
  }

  async getLoginOptions(body: GetLoginOptionsDto) {
    const userByEmail = await this.userService.getRawUser({
      email: body.email,
    });
    if (userByEmail) {
      return {
        email: userByEmail.email,
      };
    }

    const userByPhone = await this.userService.getRawUser({
      email: body.phone,
    });
    if (userByPhone) {
      return {
        phone: userByEmail.phone,
      };
    }
    return {
      email: null,
      phone: null,
    };
  }

  async login(body: LoginUserDto) {
    const user = await this.userService.getRawUser({ email: body.email });

    if (!user) {
      throw new UnauthorizedException(resError(ErrorCode.USER_NOT_FOUND));
    }

    if (!this.comparePassword(body.password, user.password)) {
      throw new UnauthorizedException(resError(ErrorCode.PASSWORD_NOT_MATCH));
    }

    return this.getTokens(user);
  }

  async signUp(body: SignUpUserDto) {
    const user = await this.userService.getRawUser({ email: body.email });
    if (user) {
      checkUserStatus(user);
    }
    const code = await this._genCodeVerify();

    const encryptCode = this._encryptCode(body.email);

    await this.userService.createUser({
      name: body.name,
      email: body.email,
      password: this.hashPassword(body.password),
      code,
    });

    // send email
    // await this.emailService.sendCodeVerifyUser(body.email, body.name, code);

    return {
      token: encryptCode,
    };
  }

  async verifyCode(body: VerifyCodeDto) {
    try {
      const decryptedData = privateDecrypt(
        {
          key: this.verifyCodePrivateKey,
          padding: constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha512',
        },
        Buffer.from(body.token, 'base64'),
      );
      const decryptedDataUtf8 = decryptedData.toString('utf-8');
      const { email, expireTime } = JSON.parse(decryptedDataUtf8);

      if (expireTime < new Date().getTime()) {
        throw new BadRequestException({ message: 'code expired' });
      }
      const userDetail = await this.userService.getRawUser({
        code: body.code,
        email,
      });

      if (userDetail) {
        await this.userService.updateUser(userDetail.id, {
          status: UserStatus.ACTIVE,
        });
        return this.getTokens(userDetail);
      }
      throw new BadRequestException();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  async _genCodeVerify() {
    const code = generateRandomNumber(6);
    const checkCodeExist = await this.userService.getRawUser({ code });
    if (checkCodeExist) {
      return await this._genCodeVerify();
    }
    return code;
  }

  _encryptCode(email: string) {
    const encryptedData = publicEncrypt(
      {
        key: this.verifyCodePublicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha512',
      },
      Buffer.from(
        JSON.stringify({ email, expireTime: new Date().getTime() + 3600000 }),
        'utf-8',
      ),
    );
    return encryptedData.toString('base64');
  }

  async getTokens(userDetail: UserDocument) {
    const tokenData = {
      userId: userDetail.id,
      role: userDetail.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenData, {
        privateKey: this.privateKey,
        algorithm: 'RS512',
        expiresIn: '1500m',
      }),
      this.jwtService.signAsync(tokenData, {
        privateKey: this.privateKey,
        algorithm: 'RS512',
        expiresIn: '7d',
      }),
    ]);

    await this.authModel.updateOne(
      { userId: userDetail.id },
      {
        refreshToken,
      },
      {
        upsert: true,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async renewAccessToken(userId: string) {
    const user = await this.userService.getRawUser({ _id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.getTokens(user);
  }

  hashPassword(password: string) {
    const saltOrRounds = 10;
    return hashSync(password, saltOrRounds);
  }

  comparePassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
