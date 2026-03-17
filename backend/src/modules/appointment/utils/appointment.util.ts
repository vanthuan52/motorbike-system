import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { AppointmentDoc } from '../entities/appointment.entity';
import {
  IAppointmentDoc,
  IAppointmentEntity,
} from '../interfaces/appointment.interface';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentDto } from '../dtos/appointment.dto';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';

@Injectable()
export class AppointmentUtil {
  mapList(
    appointments: IAppointmentDoc[] | IAppointmentEntity[] | AppointmentDoc[],
  ): AppointmentListResponseDto[] {
    return plainToInstance(
      AppointmentListResponseDto,
      appointments.map(
        (a: IAppointmentDoc | IAppointmentEntity | AppointmentDoc) =>
          a instanceof Document ? a.toObject() : a,
      ),
    );
  }

  mapGet(
    appointment: IAppointmentDoc | IAppointmentEntity | AppointmentDoc,
  ): AppointmentDto {
    return plainToInstance(
      AppointmentDto,
      appointment instanceof Document ? appointment.toObject() : appointment,
    );
  }

  mapGetPopulate(
    appointment: IAppointmentDoc | IAppointmentEntity | AppointmentDoc,
  ): AppointmentGetFullResponseDto {
    return plainToInstance(
      AppointmentGetFullResponseDto,
      appointment instanceof Document ? appointment.toObject() : appointment,
    );
  }
}
