import { IntersectionType, PickType } from '@nestjs/swagger';
import { UserLoginVerifyTwoFactorRequestDto } from '@/modules/user/dtos/request/user.login-verify-two-factor.request.dto';
import { UserTwoFactorEnableRequestDto } from '@/modules/user/dtos/request/user.two-factor-enable.request.dto';

export class UserLoginEnableTwoFactorRequestDto extends IntersectionType(
  UserTwoFactorEnableRequestDto,
  PickType(UserLoginVerifyTwoFactorRequestDto, ['challengeToken'] as const),
) {}
