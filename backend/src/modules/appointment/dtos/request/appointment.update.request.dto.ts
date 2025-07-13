import { PartialType } from '@nestjs/swagger';
import { AppointmentsCreateRequestDto } from './appointment.create.request.dto';

export class AppointmentsUpdateRequestDto extends PartialType(
  AppointmentsCreateRequestDto,
) {}
