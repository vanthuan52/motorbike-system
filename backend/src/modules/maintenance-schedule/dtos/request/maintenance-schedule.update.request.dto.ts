import { PartialType } from '@nestjs/swagger';
import { MaintenanceScheduleCreateRequestDto } from './maintenance-schedule.create.request.dto';

export class MaintenanceScheduleUpdateRequestDto extends PartialType(
  MaintenanceScheduleCreateRequestDto,
) {}
