import { Module } from '@nestjs/common';
import { CareRecordChecklistService } from './services/care-record-checklist.service';
import { CareRecordChecklistUtil } from './utils/care-record-checklist.util';
import { CareRecordChecklistRepository } from './repository/care-record-checklist.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CareRecordChecklistService,
    CareRecordChecklistUtil,
    CareRecordChecklistRepository,
  ],
  exports: [
    CareRecordChecklistService,
    CareRecordChecklistUtil,
    CareRecordChecklistRepository,
  ],
})
export class CareRecordChecklistModule {}
