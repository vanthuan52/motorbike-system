import { Module } from '@nestjs/common';
import { CareRecordMediaRepositoryModule } from './respository/care-record-media.repository.module';
import { CareRecordMediaService } from './services/care-record-media.service';
import { UserVehicleRepositoryModule } from '../user-vehicle/repository/user-vehicle.repository.module';
import { AppointmentRepositoryModule } from '../appointment/repository/appointment.repository.module';

@Module({
  imports: [
    CareRecordMediaRepositoryModule,
    AppointmentRepositoryModule,
    UserVehicleRepositoryModule,
  ],
  controllers: [],
  providers: [CareRecordMediaService],
  exports: [CareRecordMediaRepositoryModule, CareRecordMediaService],
})
export class CareRecordMediaModule {}
