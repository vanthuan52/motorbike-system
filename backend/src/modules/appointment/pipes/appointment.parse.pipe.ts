import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentDoc } from '../entities/appointment.entity';
import { ENUM_APPOINTMENT_STATUS_CODE_ERROR } from '../enums/appointment.status-code.enum';

@Injectable()
export class AppointmentsParsePipe implements PipeTransform {
  constructor(private readonly appointmentService: AppointmentService) {}

  async transform(value: any) {
    const Appointment: AppointmentDoc | null =
      await this.appointmentService.findOneById(value);

    if (!Appointment) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENT_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    }

    return Appointment;
  }
}

@Injectable()
export class AppointmentsActiveParsePipe implements PipeTransform {
  constructor(private readonly AppointmentsService: AppointmentService) {}

  async transform(value: any) {
    const Appointment =
      await this.AppointmentsService.findOneWithVehicleServiceById(value);
    if (!Appointment) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENT_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    }

    return Appointment;
  }
}
