import { ApiProperty } from '@nestjs/swagger';
import { ENUM_SERVICE_CHECKLIST_AREA } from '../../enums/service-checklist.enum';
import { DatabaseDto } from '@/common/database/dtos/database.dto';

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
    required: true,
    example: ENUM_SERVICE_CHECKLIST_AREA.ENGINE,
    enum: () => ENUM_SERVICE_CHECKLIST_AREA,
  })
  area: ENUM_SERVICE_CHECKLIST_AREA;
}
