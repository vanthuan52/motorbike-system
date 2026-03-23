import { Module } from '@nestjs/common';
import { CareRecordChecklistService } from './services/care-record-checklist.service';
import { CareRecordChecklistUtil } from './utils/care-record-checklist.util';

@Module({
  imports: [],
  controllers: [],
  providers: [CareRecordChecklistService, CareRecordChecklistUtil],
  exports: [CareRecordChecklistService, CareRecordChecklistUtil],
})
export class CareRecordChecklistModule {}
