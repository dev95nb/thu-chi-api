import { UserRole, UserStatus } from './user.schema';

export interface IUser {
  email?: string;
  password?: string;
  code?: number;
  role?: UserRole;
  name?: string;
  avatar?: string;
  status?: UserStatus;
}
