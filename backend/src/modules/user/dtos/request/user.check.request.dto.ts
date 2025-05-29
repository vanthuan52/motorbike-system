import { PickType } from '@nestjs/swagger';
import { UserCreateRequestDto } from './user.create.request.dto';

export class UserCheckEmailRequestDto extends PickType(UserCreateRequestDto, [
  'email',
] as const) {}
