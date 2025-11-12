import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CareAreaGetResponseDto } from './care-area.get.response.dto';
import { ServiceChecklistListResponseDto } from '@/modules/service-checklist/dtos/response/service-checklist.list.response.dto';

export class CareAreaWithServiceChecklistResponseDto extends CareAreaGetResponseDto {
  @ApiProperty({
    type: [ServiceChecklistListResponseDto],
    description: 'Danh sách service checklist thuộc về care area này',
  })
  @Type(() => ServiceChecklistListResponseDto)
  serviceChecklists: ServiceChecklistListResponseDto[];
}
