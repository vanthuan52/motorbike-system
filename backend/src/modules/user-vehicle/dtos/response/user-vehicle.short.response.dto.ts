import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { UserVehicleGetFullResponseDto } from './user-vehicle.full.response.dto';

export class UserVehicleShortResponseDto extends OmitType(
  UserVehicleGetFullResponseDto,
  ['vehicleModel', 'user', 'photo', 'createdAt', 'updatedAt']
) {
  @ApiHideProperty()
  @Exclude()
  vehicleModel: string;

  @ApiHideProperty()
  @Exclude()
  user: string;

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
