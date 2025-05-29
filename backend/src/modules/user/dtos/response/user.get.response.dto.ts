import { faker } from '@faker-js/faker';
import { Exclude, Type } from 'class-transformer';
import { ApiHideProperty, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { ENUM_USER_GENDER, ENUM_USER_STATUS } from '../../enums/user.enum';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';

export class UserGetResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    maxLength: 100,
    minLength: 1,
  })
  name: string;

  @ApiProperty({
    required: true,
    example: faker.internet.email(),
    maxLength: 100,
  })
  email: string;

  @ApiProperty({
    required: false,
    maxLength: 15,
    minLength: 10,
  })
  phone?: string;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
  })
  role: string;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiProperty({
    required: true,
    example: ENUM_USER_STATUS.ACTIVE,
    enum: ENUM_USER_STATUS,
  })
  status: ENUM_USER_STATUS;

  @ApiProperty({
    required: false,
    type: AwsS3ResponseDto,
    oneOf: [{ $ref: getSchemaPath(AwsS3ResponseDto) }],
  })
  @Type(() => AwsS3ResponseDto)
  photo?: AwsS3ResponseDto;

  @ApiProperty({
    example: ENUM_USER_GENDER.MALE,
    enum: ENUM_USER_GENDER,
    required: false,
  })
  gender?: ENUM_USER_GENDER;
}
