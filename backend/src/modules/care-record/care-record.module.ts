import { Module } from '@nestjs/common';
import { CareRecordRepositoryModule } from './respository/care-record.repository.module';
import { CareRecordService } from './services/care-record.service';
import { CareRecordUtil } from './utils/care-record.util';
import { AppointmentRepositoryModule } from '../appointment/repository/appointment.repository.module';
import { UserVehicleRepositoryModule } from '../user-vehicle/repository/user-vehicle.repository.module';
import { CareRecordServiceModule } from '../care-record-service/care-record-service.module';
import { VehicleServiceRepositoryModule } from '../vehicle-service/repository/vehicle-service.repository.module';
import { CareRecordChecklistModule } from '../care-record-checklist/care-record-checklist.module';
import { ServiceChecklistRepositoryModule } from '../service-checklist/repository/service-checklist.repository.module';
import { VehicleServiceModule } from '../vehicle-service/vehicle-service.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { UserVehicleModule } from '../user-vehicle/user-vehicle';

@Module({
  imports: [
    CareRecordRepositoryModule,
    AppointmentRepositoryModule,
    UserVehicleRepositoryModule,
    CareRecordServiceModule,
    VehicleServiceRepositoryModule,
    VehicleServiceModule,
    CareRecordChecklistModule,
    ServiceChecklistRepositoryModule,
    AppointmentModule,
    UserVehicleModule,
  ],
  controllers: [],
  providers: [CareRecordService, CareRecordUtil],
  exports: [CareRecordService, CareRecordUtil],
})
export class CareRecordModule {}
})
export class CareRecordModule {}
