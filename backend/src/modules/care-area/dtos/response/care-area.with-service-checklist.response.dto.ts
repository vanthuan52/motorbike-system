import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareAreaDto } from '../care-area.dto';
import { ServiceChecklistListResponseDto } from '@/modules/service-checklist/dtos/response/service-checklist.list.response.dto';

export class CareAreaWithServiceChecklistResponseDto extends CareAreaDto {
  @ApiProperty({
    type: [ServiceChecklistListResponseDto],
    description: 'Danh sách service checklist thuộc về care area này',
  })
  @Type(() => ServiceChecklistListResponseDto)
  serviceChecklists: ServiceChecklistListResponseDto[];
}
