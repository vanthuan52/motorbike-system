import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_APPOINTMENT_STATUS } from '../../enums/appointment.enum';

export class AppointmentUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_APPOINTMENT_STATUS.PENDING,
    enum: ENUM_APPOINTMENT_STATUS,
  })
  @IsEnum(ENUM_APPOINTMENT_STATUS)
  @IsNotEmpty()
  status: ENUM_APPOINTMENT_STATUS;
}
