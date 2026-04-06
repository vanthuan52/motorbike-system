import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EnumCareRecordServiceType } from '../../enums/care-record-service.enum';

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
    example: EnumCareRecordServiceType.service,
    enum: EnumCareRecordServiceType,
  })
  @IsEnum(EnumCareRecordServiceType)
  @IsNotEmpty()
  type: EnumCareRecordServiceType;
}
