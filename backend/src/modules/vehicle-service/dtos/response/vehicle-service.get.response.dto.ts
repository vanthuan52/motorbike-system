import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { Type } from 'class-transformer';
import { ENUM_VEHICLE_SERVICE_STATUS } from '../../enums/vehicle-service.enum';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';

export class VehicleServiceGetResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    maxLength: 150,
    minLength: 1,
  })
  name: string;

  @ApiProperty({
    required: true,
    maxLength: 150,
    minLength: 1,
  })
  slug: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, default: '0' })
  order?: string;

  @ApiProperty({
    required: true,
    example: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    enum: () => ENUM_VEHICLE_SERVICE_STATUS,
  })
  status: ENUM_VEHICLE_SERVICE_STATUS;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
  })
  serviceCategory: string;

  @ApiProperty({
    required: false,
    type: AwsS3ResponseDto,
    oneOf: [{ $ref: getSchemaPath(AwsS3ResponseDto) }],
  })
  @Type(() => AwsS3ResponseDto)
  photo?: AwsS3ResponseDto;
}
