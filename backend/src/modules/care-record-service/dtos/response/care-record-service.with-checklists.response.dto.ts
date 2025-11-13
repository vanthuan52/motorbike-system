import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareRecordServiceGetResponseDto } from './care-record-service.get.response.dto';
import { CareRecordChecklistListResponseDto } from '@/modules/care-record-checklist/dtos/response/care-record-checklist.list.response.dto';

export class CareRecordServiceWithChecklistsResponseDto extends CareRecordServiceGetResponseDto {
  @ApiProperty({
    description: 'Danh sách checklist của care-record-service',
    type: [CareRecordChecklistListResponseDto],
    required: true,
  })
  @Type(() => CareRecordChecklistListResponseDto)
  checklists: CareRecordChecklistListResponseDto[];
}
