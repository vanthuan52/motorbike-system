import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentDto } from '../dtos/appointment.dto';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';
import { AppointmentModel } from '../models/appointment.model';

@Injectable()
export class AppointmentUtil {
  mapList(appointments: AppointmentModel[]): AppointmentListResponseDto[] {
    return plainToInstance(AppointmentListResponseDto, appointments);
  }

  mapGet(appointment: AppointmentModel): AppointmentDto {
    return plainToInstance(AppointmentDto, appointment);
  }

  mapGetPopulate(appointment: AppointmentModel): AppointmentGetFullResponseDto {
    return plainToInstance(AppointmentGetFullResponseDto, appointment);
  }

  mapActivityLogMetadata(appointment: AppointmentModel): Record<string, any> {
    return {
      appointmentId: appointment.id,
      name: appointment.name,
      phone: appointment.phone,
      status: appointment.status,
    };
  }
}
