import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ENUM_USER_ROLE, ENUM_USER_STATUS } from '../enums/user.enum';
import { IsOptional, IsUUID } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    example: '1',
    description: 'User id',
  })
  id: string;

  @ApiProperty({
    example: 'abc@example.com',
    description: 'Phone',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    example: 'abc@example.com',
    description: 'Email',
  })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    example: ENUM_USER_ROLE.USER,
    enum: ENUM_USER_ROLE,
    description: 'User role',
  })
  role: ENUM_USER_ROLE;

  @ApiProperty({
    example: ENUM_USER_STATUS.ACTIVE,
    enum: ENUM_USER_STATUS,
    description: 'User status',
  })
  status: ENUM_USER_STATUS;

  @ApiProperty({
    example: new Date(),
    description: 'User registation date',
  })
  @ApiProperty({ example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212' })
  @IsOptional()
  @IsUUID()
  createBy?: string;

  @ApiProperty({ example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212' })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;

  @Exclude()
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'User update date',
  })
  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
