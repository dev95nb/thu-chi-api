import { ErrorCode } from '@apps/api/const/common';
import { UserRole } from '@apps/api/user/user.schema';
import { resError } from '@apps/api/utils/error';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IUserAuth } from '../auth.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest() as { user: IUserAuth };
    const userRole = user?.role;
    return this._checkUserRole(requiredRoles, userRole);
  }

  private _checkUserRole(requiredRoles: UserRole[], userRole: UserRole) {
    if (!requiredRoles || !userRole || !requiredRoles.length) {
      return false;
    }
    const hasRoleAllow = requiredRoles.some(
      (requiredRole) => requiredRole === userRole,
    );
    if (!hasRoleAllow) {
      throw new UnauthorizedException(resError(ErrorCode.ROLE_NOT_ALLOW));
    }
    return true;
  }
}
