import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VehicleServiceDto } from '../vehicle-service.dto';
import { ServiceCategoryDto } from '@/modules/service-category/dtos/service-category.dto';
import { ServiceChecklistDto } from '@/modules/service-checklist/dtos/service-checklist.dto';

export class VehicleServiceGetFullResponseDto extends OmitType(
  VehicleServiceDto,
  ['serviceCategory', 'checklistItems'] as const,
) {
  @ApiProperty({
    required: true,
    type: ServiceCategoryDto,
    oneOf: [{ $ref: getSchemaPath(ServiceCategoryDto) }],
  })
  @Type(() => ServiceCategoryDto)
  serviceCategory: ServiceCategoryDto;

  @ApiProperty({
    required: true,
    type: ServiceChecklistDto,
    oneOf: [{ $ref: getSchemaPath(ServiceChecklistDto) }],
  })
  @Type(() => ServiceChecklistDto)
  checklistItems: ServiceChecklistDto;
}
