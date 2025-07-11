import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VehicleServiceGetResponseDto } from './vehicle-service.get.response.dto';
import { ServiceCategoryGetResponseDto } from '@/modules/service-category/dtos/response/service-category.get.response.dto';
import { ServiceChecklistGetResponseDto } from '@/modules/service-checklist/dtos/response/service-checklist.get.response.dto';

export class VehicleServiceGetFullResponseDto extends OmitType(
  VehicleServiceGetResponseDto,
  ['serviceCategory', 'checklistItems'] as const,
) {
  @ApiProperty({
    required: true,
    type: ServiceCategoryGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(ServiceCategoryGetResponseDto) }],
  })
  @Type(() => ServiceCategoryGetResponseDto)
  serviceCategory: ServiceCategoryGetResponseDto;

  @ApiProperty({
    required: true,
    type: ServiceChecklistGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(ServiceChecklistGetResponseDto) }],
  })
  @Type(() => ServiceChecklistGetResponseDto)
  checklistItems: ServiceChecklistGetResponseDto;
}
