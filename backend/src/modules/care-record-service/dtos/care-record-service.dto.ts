import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { faker } from '@faker-js/faker';
import {
  EnumCareRecordServiceStatus,
  EnumCareRecordServiceType,
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
    example: EnumCareRecordServiceStatus.pending,
    enum: EnumCareRecordServiceStatus,
  })
  @Expose()
  status?: EnumCareRecordServiceStatus;

  @ApiProperty({
    description: 'Loại dịch vụ',
    example: EnumCareRecordServiceType.service,
    enum: EnumCareRecordServiceType,
  })
  @Expose()
  type: EnumCareRecordServiceType;
}
