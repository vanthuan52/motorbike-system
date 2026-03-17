import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { UserLoginRequestDto } from '@/modules/user/dtos/request/user.login.request.dto';
import { UserSignUpRequestDto } from '@/modules/user/dtos/request/user.sign-up.request.dto';

export class UserCreateSocialRequestDto extends IntersectionType(
  OmitType(UserSignUpRequestDto, ['email', 'from', 'password'] as const),
  PickType(UserLoginRequestDto, ['from']),
) {}
