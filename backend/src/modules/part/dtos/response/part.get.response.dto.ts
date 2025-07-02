import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ENUM_PART_STATUS } from '../../enums/part.enum';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';
import { Type } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

export class PartGetResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    maxLength: 150,
    minLength: 1,
  })
  name: string;

  @ApiProperty({
    required: true,
    maxLength: 200,
    minLength: 1,
  })
  slug: string;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
  })
  vehicleBrand: string;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
  })
  partType: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({
    required: true,
    example: ENUM_PART_STATUS.ACTIVE,
    enum: () => ENUM_PART_STATUS,
  })
  status: ENUM_PART_STATUS;

  @ApiProperty({
    required: false,
    type: AwsS3ResponseDto,
    oneOf: [{ $ref: getSchemaPath(AwsS3ResponseDto) }],
  })
  @Type(() => AwsS3ResponseDto)
  photo?: AwsS3ResponseDto;
}
