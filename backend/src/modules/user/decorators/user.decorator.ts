import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserGuard } from '@/modules/user/guards/user.guard';

export function UserProtected(): MethodDecorator {
  return applyDecorators(UseGuards(UserGuard));
}
