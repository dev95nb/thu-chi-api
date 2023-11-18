import { UserRole } from '../user/user.schema';

export interface ITokenData {
  userId: string;
  refreshToken: string;
}

export interface IUserAuth {
  userId?: string;
  role?: UserRole;
}
