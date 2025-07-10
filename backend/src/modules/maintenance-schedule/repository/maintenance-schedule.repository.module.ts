import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceScheduleRepository } from './maintenance-schedule.repository';
import {
  MaintenanceScheduleEntity,
  MaintenanceScheduleSchema,
} from '../entities/maintenance-schedule.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [MaintenanceScheduleRepository],
  exports: [MaintenanceScheduleRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: MaintenanceScheduleEntity.name,
          schema: MaintenanceScheduleSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class MaintenanceScheduleRepositoryModule {}
