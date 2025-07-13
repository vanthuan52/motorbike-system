import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';
import { UserVehicleListResponseDto } from './user-vehicle.list.response.dto';

export class UserVehicleShortResponseDto extends OmitType(
  UserVehicleListResponseDto,
  ['vehicleModel', 'user', 'photo', 'createdAt', 'updatedAt'],
) {
  @ApiHideProperty()
  @Exclude()
  vehicleModel: string;

  @ApiHideProperty()
  @Exclude()
  user: string;

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
