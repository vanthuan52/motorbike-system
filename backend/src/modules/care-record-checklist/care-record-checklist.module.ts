import { Module } from '@nestjs/common';
import { CareRecordChecklistRepositoryModule } from './respository/care-record-checklist.repository.module';
import { CareRecordChecklistService } from './services/care-record-checklist.service';

@Module({
  imports: [CareRecordChecklistRepositoryModule],
  controllers: [],
  providers: [CareRecordChecklistService],
  exports: [CareRecordChecklistRepositoryModule, CareRecordChecklistService],
})
export class CareRecordChecklistModule {}
