import { Module } from '@nestjs/common';
import { CareRecordChecklistRepositoryModule } from './respository/care-record-checklist.repository.module';
import { CareRecordChecklistService } from './services/care-record-checklist.service';
import { CareRecordChecklistUtil } from './utils/care-record-checklist.util';

@Module({
  imports: [CareRecordChecklistRepositoryModule],
  controllers: [],
  providers: [CareRecordChecklistService, CareRecordChecklistUtil],
  exports: [
    CareRecordChecklistRepositoryModule,
    CareRecordChecklistService,
    CareRecordChecklistUtil,
  ],
})
export class CareRecordChecklistModule {}
