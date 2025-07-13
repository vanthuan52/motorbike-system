import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentRepository } from './appointment.repository';
import {
  AppointmentEntity,
  AppointmentSchema,
} from '../entities/appointment.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [AppointmentRepository],
  exports: [AppointmentRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: AppointmentEntity.name,
          schema: AppointmentSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class AppointmentRepositoryModule {}
