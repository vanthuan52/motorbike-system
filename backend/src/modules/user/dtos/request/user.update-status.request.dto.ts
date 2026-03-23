import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnumUserStatus } from '@/generated/prisma-client';

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
