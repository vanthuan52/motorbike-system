import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ENUM_USER_STATUS } from '../enums/user.enum';

/* Define system data, seperate with database */
export class User {
  @ApiProperty({ type: String, example: '1' })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Thien',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({
    required: false,
    type: String,
    example: '0333666999',
  })
  phone?: string;

  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({
    type: () => String,
    required: true,
  })
  role: string;

  @ApiProperty({
    type: () => String,
    required: false,
    example: ENUM_USER_STATUS.ACTIVE,
    enum: ENUM_USER_STATUS,
    default: ENUM_USER_STATUS.ACTIVE,
  })
  status?: ENUM_USER_STATUS;

  @ApiProperty({ type: Boolean, example: false, default: false })
  deleted?: boolean;

  @ApiProperty({ type: String, example: '1' })
  createdBy?: string;

  @ApiProperty({ type: String, example: '1' })
  updatedBy?: string;

  @ApiProperty({ type: String, example: '1' })
  deletedBy?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  deletedAt?: Date;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
