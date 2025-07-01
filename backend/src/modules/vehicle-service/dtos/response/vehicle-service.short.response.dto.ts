import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ENUM_VEHICLE_SERVICE_STATUS } from '../../enums/vehicle-service.enum';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';
import { VehicleServiceListResponseDto } from './vehicle-service.list.response.dto';

export class VehicleServiceShortResponseDto extends OmitType(
  VehicleServiceListResponseDto,
  ['serviceCategory', 'status', 'photo', 'createdAt', 'updatedAt'],
) {
  @ApiHideProperty()
  @Exclude()
  serviceCategory: string;

  @ApiHideProperty()
  @Exclude()
  status: ENUM_VEHICLE_SERVICE_STATUS;

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
