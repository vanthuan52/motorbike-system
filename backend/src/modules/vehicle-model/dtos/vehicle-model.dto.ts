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
  EnumVehicleModelFuelType,
  EnumVehicleModelStatus,
  EnumVehicleModelType,
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
  orderBy?: number;

  @ApiProperty({
    example: EnumVehicleModelStatus.active,
    enum: EnumVehicleModelStatus,
  })
  @Expose()
  status: EnumVehicleModelStatus;

  @ApiPropertyOptional({
    example: EnumVehicleModelType.unknown,
    description: 'Phân loại kiểu dáng của xe',
    enum: EnumVehicleModelType,
  })
  @Expose()
  type?: EnumVehicleModelType;

  @ApiPropertyOptional({
    example: EnumVehicleModelFuelType.unknown,
    description: 'Phân loại nhiên liệu của xe',
    enum: EnumVehicleModelFuelType,
  })
  @Expose()
  fuelType?: EnumVehicleModelFuelType;

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
