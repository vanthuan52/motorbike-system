import { Module } from '@nestjs/common';
import { CareRecordRepositoryModule } from './respository/care-record.repository.module';
import { CareRecordService } from './services/care-record.service';
import { UserVehicleRepositoryModule } from '../user-vehicle/repository/user-vehicle.repository.module';
import { AppointmentRepositoryModule } from '../appointment/repository/appointment.repository.module';

@Module({
  imports: [
    CareRecordRepositoryModule,
    AppointmentRepositoryModule,
    UserVehicleRepositoryModule,
  ],
  controllers: [],
  providers: [CareRecordService],
  exports: [CareRecordRepositoryModule, CareRecordService],
})
export class CareRecordModule {}
