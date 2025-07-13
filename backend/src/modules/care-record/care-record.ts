import { Module } from '@nestjs/common';
import { CareRecordRepositoryModule } from './respository/care-record.repository.module';
import { CareRecordService } from './services/care-record.service';
import { VehicleModelRepositoryModule } from '../vehicle-model/repository/vehicle-model.repository.module';

@Module({
  imports: [CareRecordRepositoryModule, VehicleModelRepositoryModule],
  controllers: [],
  providers: [CareRecordService],
  exports: [CareRecordRepositoryModule, CareRecordService],
})
export class CareRecordModule {}
