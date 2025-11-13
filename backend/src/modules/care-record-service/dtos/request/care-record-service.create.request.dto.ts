import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
  IsEnum,
} from 'class-validator';
import { ENUM_CARE_RECORD_SERVICE_TYPE } from '../../enums/care-record-service.enum';

export class CareRecordServiceCreateRequestDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID lịch hẹn',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  careRecord: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID lịch hẹn',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  vehicleService?: string;

  @ApiProperty({
    example: 'Service name',
    description: 'Service name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    example: ENUM_CARE_RECORD_SERVICE_TYPE.SERVICE,
    enum: ENUM_CARE_RECORD_SERVICE_TYPE,
  })
  @IsEnum(ENUM_CARE_RECORD_SERVICE_TYPE)
  @IsNotEmpty()
  type: ENUM_CARE_RECORD_SERVICE_TYPE;
}
