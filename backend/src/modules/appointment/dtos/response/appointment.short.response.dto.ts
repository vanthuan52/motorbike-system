import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { EnumAppointmentStatus } from '../../enums/appointment.enum';
import { AppointmentDto } from '../appointment.dto';

export class AppointmentShortResponseDto extends OmitType(AppointmentDto, [
  'vehicleServices',
  'status',
  'createdAt',
  'updatedAt',
]) {
  @ApiHideProperty()
  @Exclude()
  vehicleServices: string;

  @ApiHideProperty()
  @Exclude()
  status: EnumAppointmentStatus;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
