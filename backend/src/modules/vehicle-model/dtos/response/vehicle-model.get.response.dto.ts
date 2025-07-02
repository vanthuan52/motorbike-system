import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { Type } from 'class-transformer';
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
} from '../../enums/vehicle-model.enum';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';

export class VehicleModelGetResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    maxLength: 150,
    minLength: 1,
  })
  name: string;

  @ApiProperty({
    example: 'Honda Wave Alpha 110 2019',
    description: 'Tên dòng xe đầy đủ',
    required: true,
    maxLength: 200,
  })
  fullName: string;

  @ApiProperty({
    required: true,
    maxLength: 250,
    minLength: 1,
  })
  slug: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, default: '0' })
  order?: string;

  @ApiProperty({
    required: true,
    example: ENUM_VEHICLE_MODEL_STATUS.ACTIVE,
    enum: () => ENUM_VEHICLE_MODEL_STATUS,
  })
  status: ENUM_VEHICLE_MODEL_STATUS;

  @ApiProperty({
    example: ENUM_VEHICLE_MODEL_TYPE.UNKNOWN,
    description:
      'Phân loại kiểu dáng của xe (unknown/scooter/manual/clutch/electric)',
    required: false,
    enum: () => ENUM_VEHICLE_MODEL_TYPE,
  })
  type?: ENUM_VEHICLE_MODEL_TYPE;

  @ApiProperty({
    example: ENUM_VEHICLE_MODEL_FUEL_TYPE.UNKNOWN,
    description:
      'Phân loại nhiên liệu của xe (unknown/gasoline/hybrid/electric)',
    required: false,
    enum: () => ENUM_VEHICLE_MODEL_FUEL_TYPE,
  })
  fuelType?: ENUM_VEHICLE_MODEL_FUEL_TYPE;

  @ApiProperty({
    example: 2020,
    description: 'Năm bắt đầu sản xuất/phân phối',
    required: false,
  })
  yearStart?: number;

  @ApiProperty({
    example: 2020,
    description: 'Năm ngừng sản xuất/phân phối',
    required: false,
  })
  yearEnd?: number;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
  })
  vehicleBrand: string;

  @ApiProperty({
    required: false,
    type: AwsS3ResponseDto,
    oneOf: [{ $ref: getSchemaPath(AwsS3ResponseDto) }],
  })
  @Type(() => AwsS3ResponseDto)
  photo?: AwsS3ResponseDto;
}
