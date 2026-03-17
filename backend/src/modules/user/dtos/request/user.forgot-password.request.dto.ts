import { PickType } from '@nestjs/swagger';
import { UserLoginRequestDto } from '@/modules/user/dtos/request/user.login.request.dto';

export class UserForgotPasswordRequestDto extends PickType(
  UserLoginRequestDto,
  ['email'] as const,
) {}
