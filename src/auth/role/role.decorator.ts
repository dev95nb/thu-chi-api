import { UserRole } from '@apps/api/user/user.schema';
import { SetMetadata } from '@nestjs/common';

export const Role = (args: UserRole[]) => SetMetadata('role', args);
