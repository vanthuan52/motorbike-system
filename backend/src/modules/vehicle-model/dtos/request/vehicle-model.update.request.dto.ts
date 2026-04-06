import { PartialType } from '@nestjs/swagger';
import { VehicleModelCreateRequestDto } from './vehicle-model.create.request.dto';

export class VehicleModelUpdateRequestDto extends PartialType(
  VehicleModelCreateRequestDto
) {}
