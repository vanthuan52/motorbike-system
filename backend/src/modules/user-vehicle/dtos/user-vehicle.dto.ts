import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';

export class UserVehicleDto extends DatabaseDto {
  @ApiProperty({
    description: 'Biển số xe',
    example: '69FA-88888',
    maxLength: 20,
  })
  @Expose()
  licensePlateNumber: string;

  @ApiPropertyOptional({
    example: 2021,
    description: 'Đời xe',
  })
  @Expose()
  modelYear?: number;

  @ApiPropertyOptional({
    example: 'Đỏ đen',
    description: 'Mùa xe',
    maxLength: 200,
  })
  @Expose()
  color?: string;

  @ApiPropertyOptional({
    example: 'SNIFHEUI47821748',
    description: 'Số máy',
    maxLength: 30,
    minLength: 1,
  })
  @Expose()
  engineNumber?: string;

  @ApiPropertyOptional({
    example: 'KKIFHEUI47821748',
    description: 'Số khung',
    maxLength: 30,
    minLength: 1,
  })
  @Expose()
  chassisNumber?: string;

  @ApiProperty({
    example: faker.string.uuid(),
  })
  @Expose()
  vehicleModel: string;

  @ApiProperty({
    example: faker.string.uuid(),
  })
  @Expose()
  user: string;

  @ApiPropertyOptional({
    type: AwsS3Dto,
    oneOf: [{ $ref: getSchemaPath(AwsS3Dto) }],
  })
  @Type(() => AwsS3Dto)
  @Expose()
  photo?: AwsS3Dto;
}
