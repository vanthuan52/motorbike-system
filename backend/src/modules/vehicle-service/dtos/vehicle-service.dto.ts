import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { EnumVehicleServiceStatus } from '../enums/vehicle-service.enum';

export class VehicleServiceDto extends DatabaseDto {
  @ApiProperty({ maxLength: 150, minLength: 1 })
  @Expose()
  name: string;

  @ApiProperty({ maxLength: 150, minLength: 1 })
  @Expose()
  slug: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional({ default: 0 })
  @Expose()
  orderBy?: number;

  @ApiProperty({
    example: EnumVehicleServiceStatus.active,
    enum: () => EnumVehicleServiceStatus,
  })
  @Expose()
  status: EnumVehicleServiceStatus;

  @ApiProperty({ example: faker.string.uuid() })
  @Expose()
  serviceCategory: string;

  @ApiPropertyOptional({
    type: AwsS3Dto,
    oneOf: [{ $ref: getSchemaPath(AwsS3Dto) }],
  })
  @Type(() => AwsS3Dto)
  @Expose()
  photo?: AwsS3Dto;

  @ApiProperty({ example: [] })
  @Expose()
  checklistItems: string[];
}
