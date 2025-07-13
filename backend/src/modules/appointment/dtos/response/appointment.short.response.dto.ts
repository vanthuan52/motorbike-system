import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ENUM_APPOINTMENTS_STATUS } from '../../enums/appointment.enum';
import { AwsS3ResponseDto } from '@/modules/aws/dtos/response/aws.s3-response.dto';
import { AppointmentsListResponseDto } from './appointment.list.response.dto';

export class AppointmentShortResponseDto extends OmitType(
  AppointmentsListResponseDto,
  ['vehicleServices', 'status', 'createdAt', 'updatedAt'],
) {
  @ApiHideProperty()
  @Exclude()
  vehicleServices: string;

  @ApiHideProperty()
  @Exclude()
  status: ENUM_APPOINTMENTS_STATUS;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
