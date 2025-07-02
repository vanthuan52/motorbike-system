import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
} from '../../enums/vehicle-model.enum';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';
import { VehicleModelListResponseDto } from './vehicle-model.list.response.dto';

export class VehicleModelShortResponseDto extends OmitType(
  VehicleModelListResponseDto,
  [
    'vehicleBrand',
    'status',
    'type',
    'fuelType',
    'photo',
    'createdAt',
    'updatedAt',
  ],
) {
  @ApiHideProperty()
  @Exclude()
  vehicleBrand: string;

  @ApiHideProperty()
  @Exclude()
  status: ENUM_VEHICLE_MODEL_STATUS;

  @ApiHideProperty()
  @Exclude()
  type: ENUM_VEHICLE_MODEL_TYPE;

  @ApiHideProperty()
  @Exclude()
  fuelType: ENUM_VEHICLE_MODEL_FUEL_TYPE;

  @ApiHideProperty()
  @Exclude()
  photo?: AwsS3ResponseDto;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
