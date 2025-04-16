import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  ENUM_USER_GENDER,
  ENUM_USER_STATUS,
  ENUM_USER_TYPE,
} from '../enums/user.enum';

/* Define system data, seperate with database */
export class User {
  @ApiProperty({ type: String, example: '1' })
  _id: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Thien',
  })
  first_name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Nguyen Anh',
  })
  last_name: string;

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
    required: false,
    type: () => String,
    example: ENUM_USER_TYPE.CUSTOMER,
    enum: ENUM_USER_TYPE,
  })
  type?: ENUM_USER_TYPE;

  @ApiProperty({
    type: String,
    required: true,
    example: 'uuid',
  })
  ref_id?: string;

  @ApiProperty({
    type: () => String,
    required: false,
    example: ENUM_USER_STATUS.ACTIVE,
    enum: ENUM_USER_STATUS,
  })
  status?: ENUM_USER_STATUS;

  @ApiProperty({
    type: String,
    required: false,
    example: 'photo path',
  })
  photo?: string;

  @ApiProperty({
    type: () => String,
    required: false,
    example: ENUM_USER_GENDER.MALE,
    enum: ENUM_USER_GENDER,
  })
  gender?: ENUM_USER_GENDER;

  @ApiProperty({
    required: false,
    type: Date,
    example: '2000/12/24',
  })
  dob?: Date;

  @ApiProperty({
    required: false,
    type: Date,
    example: '123 Pham Văn Đồng',
  })
  address?: string;

  @ApiProperty({
    required: false,
    type: Date,
    example: 'Phường 10',
  })
  ward?: string;

  @ApiProperty({
    required: false,
    type: Date,
    example: 'Bình Thạnh',
  })
  district?: string;

  @ApiProperty({
    required: false,
    type: Date,
    example: 'Hồ Chí Minh',
  })
  city?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
