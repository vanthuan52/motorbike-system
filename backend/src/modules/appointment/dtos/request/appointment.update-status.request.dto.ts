import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumAppointmentStatus } from '../../enums/appointment.enum';

export class AppointmentUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: EnumAppointmentStatus.pending,
    enum: EnumAppointmentStatus,
  })
  @IsEnum(EnumAppointmentStatus)
  @IsNotEmpty()
  status: EnumAppointmentStatus;
}
