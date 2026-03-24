import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnumUserStatus } from '@/modules/user/enums/user.enum';

export class UserUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    enum: EnumUserStatus,
    default: EnumUserStatus.active,
  })
  @IsString()
  @IsEnum(EnumUserStatus)
  @IsNotEmpty()
  status: EnumUserStatus;
}
