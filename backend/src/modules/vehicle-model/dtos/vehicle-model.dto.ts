import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
} from '../enums/vehicle-model.enum';

export class VehicleModelDto extends DatabaseDto {
  @ApiProperty({ maxLength: 150, minLength: 1 })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Honda Wave Alpha 110 2019',
    description: 'Tên dòng xe đầy đủ',
    maxLength: 200,
  })
  @Expose()
  fullName: string;

  @ApiProperty({ maxLength: 250, minLength: 1 })
  @Expose()
  slug: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional({ default: 0 })
  @Expose()
  order?: number;

  @ApiProperty({
    example: ENUM_VEHICLE_MODEL_STATUS.ACTIVE,
    enum: () => ENUM_VEHICLE_MODEL_STATUS,
  })
  @Expose()
  status: ENUM_VEHICLE_MODEL_STATUS;

  @ApiPropertyOptional({
    example: ENUM_VEHICLE_MODEL_TYPE.UNKNOWN,
    description: 'Phân loại kiểu dáng của xe',
    enum: () => ENUM_VEHICLE_MODEL_TYPE,
  })
  @Expose()
  type?: ENUM_VEHICLE_MODEL_TYPE;

  @ApiPropertyOptional({
    example: ENUM_VEHICLE_MODEL_FUEL_TYPE.UNKNOWN,
    description: 'Phân loại nhiên liệu của xe',
    enum: () => ENUM_VEHICLE_MODEL_FUEL_TYPE,
  })
  @Expose()
  fuelType?: ENUM_VEHICLE_MODEL_FUEL_TYPE;

  @ApiPropertyOptional({
    example: 2020,
    description: 'Năm bắt đầu sản xuất',
  })
  @Expose()
  yearStart?: number;

  @ApiPropertyOptional({
    example: 2023,
    description: 'Năm ngừng sản xuất',
  })
  @Expose()
  yearEnd?: number;

  @ApiProperty({ example: faker.string.uuid() })
  @Expose()
  vehicleBrand: string;

  @ApiPropertyOptional({
    type: AwsS3Dto,
    oneOf: [{ $ref: getSchemaPath(AwsS3Dto) }],
  })
  @Type(() => AwsS3Dto)
  @Expose()
  photo?: AwsS3Dto;
}
