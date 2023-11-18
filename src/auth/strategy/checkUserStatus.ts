import { ErrorCode } from '@apps/api/const/common';
import { UserDocument, UserStatus } from '@apps/api/user/user.schema';
import { resError } from '@apps/api/utils/error';
import { UnauthorizedException } from '@nestjs/common';

export function checkUserStatus(user: UserDocument) {
  if (!user) {
    throw new UnauthorizedException(resError(ErrorCode.USER_NOT_FOUND));
  }

  if (user.status === UserStatus.ACTIVE) {
    return;
  }

  if (user.status === UserStatus.BLOCK) {
    throw new UnauthorizedException(resError(ErrorCode.USER_BLOCKED));
  }

  if (user.status === UserStatus.VERIFYING) {
    throw new UnauthorizedException(resError(ErrorCode.VERIFYING));
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new UnauthorizedException(resError(ErrorCode.INACTIVE));
  }

  throw new UnauthorizedException();
}
