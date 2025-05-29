import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserCensorResponseDto } from './user.censor.response.dto';

export class UserCheckResponseDto {
  @ApiProperty({
    required: true,
  })
  exist: boolean;

  @ApiProperty({
    required: false,
    type: UserCensorResponseDto,
  })
  @Type(() => UserCensorResponseDto)
  user?: UserCensorResponseDto;
}
