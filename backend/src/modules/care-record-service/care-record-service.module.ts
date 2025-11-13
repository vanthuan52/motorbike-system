import { Module } from '@nestjs/common';
import { CareRecordServiceRepositoryModule } from './respository/care-record-service.repository.module';
import { CareRecordServiceService } from './services/care-record-service.service';

@Module({
  imports: [CareRecordServiceRepositoryModule],
  controllers: [],
  providers: [CareRecordServiceService],
  exports: [CareRecordServiceRepositoryModule, CareRecordServiceService],
})
export class CareRecordServiceModule {}
