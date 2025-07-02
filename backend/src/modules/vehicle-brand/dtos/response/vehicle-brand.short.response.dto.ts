import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { VehicleBrandGetResponseDto } from './vehicle-brand.get.response.dto';

export class VehicleBrandShortResponseDto extends OmitType(
  VehicleBrandGetResponseDto,
  ['createdAt', 'updatedAt'],
) {
  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
