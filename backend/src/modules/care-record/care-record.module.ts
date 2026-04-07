import { Module } from '@nestjs/common';
import { CareRecordService } from './services/care-record.service';
import { CareRecordUtil } from './utils/care-record.util';
import { CareRecordServiceModule } from '../care-record-service/care-record-service.module';
import { CareRecordChecklistModule } from '../care-record-checklist/care-record-checklist.module';
import { VehicleServiceModule } from '../vehicle-service/vehicle-service.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { UserVehicleModule } from '../user-vehicle/user-vehicle.module';
import { CareRecordRepository } from './repository/care-record.repository';

@Module({
  imports: [
    CareRecordServiceModule,
    VehicleServiceModule,
    CareRecordChecklistModule,
    AppointmentModule,
    UserVehicleModule,
  ],
  controllers: [],
  providers: [CareRecordService, CareRecordUtil, CareRecordRepository],
  exports: [CareRecordService, CareRecordUtil, CareRecordRepository],
})
export class CareRecordModule {}
