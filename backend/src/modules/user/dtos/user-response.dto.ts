import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ENUM_USER_STATUS } from '../enums/user.enum';

export class UserResponseDto {
  @ApiProperty({
    example: '1',
    description: 'User id',
  })
  id: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username of user',
  })
  username: string;

  @Exclude()
  password: string;

  @ApiProperty({
    example: ENUM_USER_STATUS.ACTIVE,
    enum: ENUM_USER_STATUS,
    description: 'User status',
  })
  status: ENUM_USER_STATUS;

  @Exclude()
  @ApiProperty({
    example: new Date(),
    description: 'Last login date',
  })
  lastLogin: Date;

  @ApiProperty({
    example: new Date(),
    description: 'User registation date',
  })
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
