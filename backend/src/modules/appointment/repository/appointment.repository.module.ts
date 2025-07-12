import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsRepository } from './appointment.repository';
import {
  AppointmentsEntity,
  AppointmentsSchema,
} from '../entities/appointment.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [AppointmentsRepository],
  exports: [AppointmentsRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: AppointmentsEntity.name,
          schema: AppointmentsSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class AppointmentsRepositoryModule {}
