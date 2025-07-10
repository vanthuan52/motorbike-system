import { Module } from '@nestjs/common';

import { MaintenanceScheduleRepositoryModule } from './repository/maintenance-schedule.repository.module';
import { MaintenanceScheduleService } from './services/maintenance-schedule.service';

@Module({
  imports: [MaintenanceScheduleRepositoryModule],
  controllers: [],
  providers: [MaintenanceScheduleService],
  exports: [MaintenanceScheduleService],
})
export class MaintenanceScheduleModule {}
