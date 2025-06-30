import { PartialType } from '@nestjs/swagger';
import { ServiceCategoryCreateRequestDto } from './service-category.create.request.dto';

export class ServiceCategoryUpdateRequestDto extends PartialType(
  ServiceCategoryCreateRequestDto,
) {}
