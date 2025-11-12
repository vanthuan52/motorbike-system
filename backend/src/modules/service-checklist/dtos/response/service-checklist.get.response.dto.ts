import { ApiProperty } from '@nestjs/swagger';

import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { ENUM_VEHICLE_MODEL_TYPE } from '@/modules/vehicle-model/enums/vehicle-model.enum';

export class ServiceChecklistGetResponseDto extends DatabaseDto {
  @ApiProperty({ example: 'Bánh xe/lốp sau' })
  name: string;

  @ApiProperty({ example: 'banh-xe-lop-sau' })
  code: string;

  @ApiProperty({ example: 'Bánh xe/lốp sau', required: false })
  description?: string;

  @ApiProperty({
    required: false,
    example: '0',
    description: 'Thứ tự hiển thị công việc',
  })
  order?: string;

  @ApiProperty({
    example: 'uuid',
    required: true,
  })
  careArea: string;

  @ApiProperty({
    example: [],
    description: 'Danh sách các loại xe mà công việc này áp dụng.',
    required: false,
  })
  vehicleType?: ENUM_VEHICLE_MODEL_TYPE[];
}
