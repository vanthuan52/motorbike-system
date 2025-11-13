import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import {
  ENUM_CARE_RECORD_SERVICE_STATUS,
  ENUM_CARE_RECORD_SERVICE_TYPE,
} from '../../enums/care-record-service.enum';

export class CareRecordServiceGetResponseDto extends DatabaseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID đơn chăm sóc',
    required: true,
  })
  careRecord: string;

  @ApiProperty({
    example: 'Service name',
    description: 'Service name',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: faker.string.uuid(),
    description: 'ID dịch vụ',
    required: false,
  })
  vehicleService: string;

  @ApiProperty({
    required: true,
    description: 'Trạng thái công việc',
    example: ENUM_CARE_RECORD_SERVICE_STATUS.PENDING,
    enum: () => ENUM_CARE_RECORD_SERVICE_STATUS,
  })
  status?: ENUM_CARE_RECORD_SERVICE_STATUS;

  @ApiProperty({
    required: true,
    description: 'Loại dịch vụ',
    example: ENUM_CARE_RECORD_SERVICE_TYPE.SERVICE,
    enum: () => ENUM_CARE_RECORD_SERVICE_TYPE,
  })
  type: ENUM_CARE_RECORD_SERVICE_TYPE;
}
