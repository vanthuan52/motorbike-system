import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserCreateRequestDto } from './user.create.request.dto';
import { EnumUserGender } from '../../enums/user.enum';

export class UserUpdateProfileRequestDto extends OmitType(
  UserCreateRequestDto,
  ['email', 'role', 'gender'] as const,
) {
  @ApiProperty({
    example: EnumUserGender.male,
    enum: EnumUserGender,
    required: false,
    description: 'User gender',
  })
  gender?: EnumUserGender;
}
