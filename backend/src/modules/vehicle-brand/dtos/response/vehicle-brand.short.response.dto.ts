import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { VehicleBrandDto } from '../vehicle-brand.dto';

export class VehicleBrandShortResponseDto extends OmitType(VehicleBrandDto, [
  'createdAt',
  'updatedAt',
]) {
  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
