import { Module } from '@nestjs/common';
import { CareRecordServiceService } from './services/care-record-service.service';
import { CareRecordServiceUtil } from './utils/care-record-service.util';
import { CareRecordChecklistModule } from '../care-record-checklist/care-record-checklist.module';
import { CareRecordRepository } from '../care-record/repository/care-record.repository';

@Module({
  imports: [CareRecordChecklistModule],
  controllers: [],
  providers: [
    CareRecordServiceService,
    CareRecordServiceUtil,
    CareRecordRepository,
  ],
  exports: [
    CareRecordServiceService,
    CareRecordServiceUtil,
    CareRecordRepository,
  ],
})
export class CareRecordServiceModule {}
