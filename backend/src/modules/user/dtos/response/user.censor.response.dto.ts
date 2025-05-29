import {
  ApiHideProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserGetResponseDto } from './user.get.response.dto';
import { UserShortResponseDto } from './user.short.response.dto';

export class UserCensorResponseDto extends IntersectionType(
  PickType(UserGetResponseDto, ['phone']),
  OmitType(UserShortResponseDto, ['email']),
) {
  @ApiHideProperty()
  @Exclude()
  username: string;

  @ApiHideProperty()
  @Exclude()
  email?: string;

  @ApiHideProperty()
  @Exclude()
  country: string;
}
