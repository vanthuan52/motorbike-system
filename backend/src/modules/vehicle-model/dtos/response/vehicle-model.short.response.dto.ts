import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  EnumVehicleModelFuelType,
  EnumVehicleModelStatus,
  EnumVehicleModelType,
} from '../../enums/vehicle-model.enum';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleModelGetFullResponseDto } from './vehicle-model.full.response.dto';

export class VehicleModelShortResponseDto extends OmitType(
  VehicleModelGetFullResponseDto,
  [
    'vehicleBrand',
    'status',
    'type',
    'fuelType',
    'photo',
    'createdAt',
    'updatedAt',
  ]
) {
  @ApiHideProperty()
  @Exclude()
  vehicleBrand: string;

  @ApiHideProperty()
  @Exclude()
  status: EnumVehicleModelStatus;

  @ApiHideProperty()
  @Exclude()
  type: EnumVehicleModelType;

  @ApiHideProperty()
  @Exclude()
  fuelType: EnumVehicleModelFuelType;

  @ApiHideProperty()
  @Exclude()
  photo?: AwsS3Dto;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
