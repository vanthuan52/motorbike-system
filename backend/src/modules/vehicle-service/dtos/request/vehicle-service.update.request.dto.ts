import { PartialType } from '@nestjs/swagger';
import { VehicleServiceCreateRequestDto } from './vehicle-service.create.request.dto';

export class VehicleServiceUpdateRequestDto extends PartialType(
  VehicleServiceCreateRequestDto
) {}
