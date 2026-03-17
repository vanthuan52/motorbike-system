import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordServiceDto } from '../care-record-service.dto';
import { CareRecordChecklistListResponseDto } from '@/modules/care-record-checklist/dtos/response/care-record-checklist.list.response.dto';

export class CareRecordServiceWithChecklistsResponseDto extends CareRecordServiceDto {
  @ApiProperty({
    description: 'Danh sách checklist của care-record-service',
    type: [CareRecordChecklistListResponseDto],
    required: true,
  })
  @Type(() => CareRecordChecklistListResponseDto)
  checklists: CareRecordChecklistListResponseDto[];
}
