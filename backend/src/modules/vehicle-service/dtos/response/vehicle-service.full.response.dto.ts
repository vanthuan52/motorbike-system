import { ApiProperty, getSchemaPath, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VehicleServiceGetResponseDto } from './vehicle-service.get.response.dto';
import { ServiceCategoryGetResponseDto } from '@/modules/service-category/dtos/response/service-category.get.response.dto';

export class VehicleServiceGetFullResponseDto extends OmitType(
  VehicleServiceGetResponseDto,
  ['serviceCategory'] as const,
) {
  @ApiProperty({
    required: true,
    type: ServiceCategoryGetResponseDto,
    oneOf: [{ $ref: getSchemaPath(ServiceCategoryGetResponseDto) }],
  })
  @Type(() => ServiceCategoryGetResponseDto)
  serviceCategory: ServiceCategoryGetResponseDto;
}
