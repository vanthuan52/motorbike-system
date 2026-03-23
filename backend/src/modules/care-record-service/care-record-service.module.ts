import { Module } from '@nestjs/common';
import { CareRecordServiceService } from './services/care-record-service.service';
import { CareRecordServiceUtil } from './utils/care-record-service.util';
import { CareRecordChecklistModule } from '../care-record-checklist/care-record-checklist.module';

@Module({
  imports: [CareRecordChecklistModule],
  controllers: [],
  providers: [CareRecordServiceService, CareRecordServiceUtil],
  exports: [, CareRecordServiceService, CareRecordServiceUtil],
})
export class CareRecordServiceModule {}
