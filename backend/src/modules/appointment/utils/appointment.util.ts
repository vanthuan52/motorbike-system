import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentDto } from '../dtos/appointment.dto';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';
import { Appointment } from '@/generated/prisma-client';

@Injectable()
export class AppointmentUtil {
  mapList(appointments: Appointment[]): AppointmentListResponseDto[] {
    return plainToInstance(AppointmentListResponseDto, appointments);
  }

  mapGet(appointment: Appointment): AppointmentDto {
    return plainToInstance(AppointmentDto, appointment);
  }

  mapGetPopulate(appointment: Appointment): AppointmentGetFullResponseDto {
    return plainToInstance(AppointmentGetFullResponseDto, appointment);
  }
}
