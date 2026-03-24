import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { AuthLoginRequestDto } from '@/modules/auth/dtos/request/auth.login.request.dto';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';

export class AuthCreateSocialRequestDto extends IntersectionType(
  OmitType(AuthSignUpRequestDto, ['email', 'from', 'password'] as const),
  PickType(AuthLoginRequestDto, ['from', 'device'] as const)
) {}
