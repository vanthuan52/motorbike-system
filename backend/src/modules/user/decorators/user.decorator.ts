import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserGuard } from '@/modules/user/guards/user.guard';
import { USER_GUARD_EMAIL_VERIFIED_META_KEY } from '../constants/user.constant';

export function UserProtected(
  emailVerified: boolean[] = [true],
): MethodDecorator {
  return applyDecorators(
    UseGuards(UserGuard),
    SetMetadata(USER_GUARD_EMAIL_VERIFIED_META_KEY, emailVerified),
  );
}
