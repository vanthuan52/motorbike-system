import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_APPOINTMENTS_STATUS } from '../../enums/appointment.enum';

export class AppointmentsUpdateStatusRequestDto {
  @ApiProperty({
    required: true,
    example: ENUM_APPOINTMENTS_STATUS.PENDING,
    enum: ENUM_APPOINTMENTS_STATUS,
  })
  @IsEnum(ENUM_APPOINTMENTS_STATUS)
  @IsNotEmpty()
  status: ENUM_APPOINTMENTS_STATUS;
}
