import { PickType } from '@nestjs/swagger';
import { UserCreateRequestDto } from '@/modules/user/dtos/request/user.create.request.dto';

export class UserImportRequestDto extends PickType(UserCreateRequestDto, [
  'email',
  'name',
]) {}
