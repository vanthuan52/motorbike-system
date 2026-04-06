import { PartialType } from '@nestjs/swagger';
import { UserVehicleCreateRequestDto } from './user-vehicle.create.request.dto';

export class UserVehicleUpdateRequestDto extends PartialType(
  UserVehicleCreateRequestDto
) {}
