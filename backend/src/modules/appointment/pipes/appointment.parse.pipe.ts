import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { AppointmentsService } from '../services/appointment.service';
import { AppointmentsDoc } from '../entities/appointment.entity';
import { ENUM_APPOINTMENTS_STATUS_CODE_ERROR } from '../enums/appointment.status-code.enum';

@Injectable()
export class AppointmentsParsePipe implements PipeTransform {
  constructor(private readonly AppointmentsService: AppointmentsService) {}

  async transform(value: any) {
    const Appointment: AppointmentsDoc | null =
      await this.AppointmentsService.findOneById(value);

    if (!Appointment) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENTS_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    }

    return Appointment;
  }
}

@Injectable()
export class AppointmentsActiveParsePipe implements PipeTransform {
  constructor(private readonly AppointmentsService: AppointmentsService) {}

  async transform(value: any) {
    const Appointment =
      await this.AppointmentsService.findOneWithServiceCategoryById(value);
    if (!Appointment) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENTS_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    }

    return Appointment;
  }
}
