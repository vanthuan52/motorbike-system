import { Module } from '@nestjs/common';
import { CareRecordRepositoryModule } from './respository/care-record.repository.module';
import { CareRecordService } from './services/care-record.service';
import { UserVehicleRepositoryModule } from '../user-vehicle/repository/user-vehicle.repository.module';
import { AppointmentRepositoryModule } from '../appointment/repository/appointment.repository.module';
import { CareRecordServiceModule } from '../care-record-service/care-record-service.module';
import { VehicleServiceRepositoryModule } from '../vehicle-service/repository/vehicle-service.repository.module';
import { CareRecordChecklistModule } from '../care-record-checklist/care-record-checklist.module';
import { ServiceChecklistRepositoryModule } from '../service-checklist/repository/service-checklist.repository.module';

@Module({
  imports: [
    CareRecordRepositoryModule,
    AppointmentRepositoryModule,
    UserVehicleRepositoryModule,
    CareRecordServiceModule,
    VehicleServiceRepositoryModule,
    CareRecordChecklistModule,
    ServiceChecklistRepositoryModule,
  ],
  controllers: [],
  providers: [CareRecordService],
  exports: [CareRecordRepositoryModule, CareRecordService],
})
export class CareRecordModule {}
