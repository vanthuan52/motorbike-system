import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import {
  ENUM_CARE_RECORD_SERVICE_STATUS,
  ENUM_CARE_RECORD_SERVICE_TYPE,
} from '../enums/care-record-service.enum';

export class CareRecordServiceDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
  })
  @Expose()
  careRecord: string;

  @ApiProperty({
    example: 'Service name',
    description: 'Service name',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    example: faker.string.uuid(),
    description: 'ID dịch vụ',
  })
  @Expose()
  vehicleService?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái công việc',
    example: ENUM_CARE_RECORD_SERVICE_STATUS.PENDING,
    enum: ENUM_CARE_RECORD_SERVICE_STATUS,
  })
  @Expose()
  status?: ENUM_CARE_RECORD_SERVICE_STATUS;

  @ApiProperty({
    description: 'Loại dịch vụ',
    example: ENUM_CARE_RECORD_SERVICE_TYPE.SERVICE,
    enum: ENUM_CARE_RECORD_SERVICE_TYPE,
  })
  @Expose()
  type: ENUM_CARE_RECORD_SERVICE_TYPE;
}
