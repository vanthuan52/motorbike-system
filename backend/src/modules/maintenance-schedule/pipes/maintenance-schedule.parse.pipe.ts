import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { MaintenanceScheduleService } from '../services/maintenance-schedule.service';
import { MaintenanceScheduleDoc } from '../entities/maintenance-schedule.entity';
import { ENUM_MAINTENANCE_SCHEDULE_STATUS_CODE_ERROR } from '../enums/maintenance-schedule.status-code.enum';

@Injectable()
export class MaintenanceScheduleParsePipe implements PipeTransform {
  constructor(
    private readonly MaintenanceScheduleService: MaintenanceScheduleService,
  ) {}

  async transform(value: any) {
    const MaintenanceSchedule: MaintenanceScheduleDoc | null =
      await this.MaintenanceScheduleService.findOneById(value);

    if (!MaintenanceSchedule) {
      throw new NotFoundException({
        statusCode: ENUM_MAINTENANCE_SCHEDULE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'maintenance-schedule.error.notFound',
      });
    }

    return MaintenanceSchedule;
  }
}

@Injectable()
export class MaintenanceScheduleActiveParsePipe implements PipeTransform {
  constructor(
    private readonly MaintenanceScheduleService: MaintenanceScheduleService,
  ) {}

  async transform(value: any) {
    const MaintenanceSchedule =
      await this.MaintenanceScheduleService.findOneWithServiceCategoryById(
        value,
      );
    if (!MaintenanceSchedule) {
      throw new NotFoundException({
        statusCode: ENUM_MAINTENANCE_SCHEDULE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'maintenance-schedule.error.notFound',
      });
    }

    return MaintenanceSchedule;
  }
}
