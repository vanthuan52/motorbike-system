import { PickType } from '@nestjs/swagger';
import { AuthLoginRequestDto } from '@/modules/auth/dtos/request/auth.login.request.dto';

export class AuthForgotPasswordRequestDto extends PickType(
  AuthLoginRequestDto,
  ['email'] as const
) {}
