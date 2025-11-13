import { Module } from '@nestjs/common';
import { CareRecordServiceRepositoryModule } from './respository/care-record-service.repository.module';
import { CareRecordServiceService } from './services/care-record-service.service';
import { CareRecordChecklistModule } from '../care-record-checklist/care-record-checklist.module';

@Module({
  imports: [CareRecordServiceRepositoryModule, CareRecordChecklistModule],
  controllers: [],
  providers: [CareRecordServiceService],
  exports: [CareRecordServiceRepositoryModule, CareRecordServiceService],
})
export class CareRecordServiceModule {}
