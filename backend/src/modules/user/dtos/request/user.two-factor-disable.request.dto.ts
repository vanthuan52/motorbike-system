import { OmitType } from '@nestjs/swagger';
import { UserLoginVerifyTwoFactorRequestDto } from '@/modules/user/dtos/request/user.login-verify-two-factor.request.dto';

export class UserTwoFactorDisableRequestDto extends OmitType(
  UserLoginVerifyTwoFactorRequestDto,
  ['challengeToken'] as const
) {}
