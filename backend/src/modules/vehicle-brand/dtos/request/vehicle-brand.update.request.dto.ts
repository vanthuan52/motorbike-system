import { PartialType } from '@nestjs/swagger';
import { VehicleBrandCreateRequestDto } from './vehicle-brand.create.request.dto';

export class VehicleBrandUpdateRequestDto extends PartialType(
  VehicleBrandCreateRequestDto
) {}
