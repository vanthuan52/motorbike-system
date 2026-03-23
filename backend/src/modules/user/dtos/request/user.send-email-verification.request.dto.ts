import { PickType } from '@nestjs/swagger';
import { UserLoginRequestDto } from '@/modules/user/dtos/request/user.login.request.dto';

export class UserSendEmailVerificationRequestDto extends PickType(
  UserLoginRequestDto,
  ['email'] as const
) {}
