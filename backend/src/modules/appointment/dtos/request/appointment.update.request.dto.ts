import { PartialType } from '@nestjs/swagger';
import { AppointmentCreateRequestDto } from './appointment.create.request.dto';

export class AppointmentUpdateRequestDto extends PartialType(
  AppointmentCreateRequestDto,
) {}
