import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ENUM_APPOINTMENT_STATUS } from '../../enums/appointment.enum';
import { AppointmentListResponseDto } from './appointment.list.response.dto';

export class AppointmentShortResponseDto extends OmitType(
  AppointmentListResponseDto,
  ['vehicleServices', 'status', 'createdAt', 'updatedAt'],
) {
  @ApiHideProperty()
  @Exclude()
  vehicleServices: string;

  @ApiHideProperty()
  @Exclude()
  status: ENUM_APPOINTMENT_STATUS;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
