import { Module } from '@nestjs/common';
import { CareRecordConditionRepositoryModule } from './respository/care-record-condition.repository.module';
import { CareRecordConditionService } from './services/care-record-condition.service';
import { CareRecordRepositoryModule } from '../care-record/respository/care-record.repository.module';

@Module({
  imports: [CareRecordConditionRepositoryModule, CareRecordRepositoryModule],
  controllers: [],
  providers: [CareRecordConditionService],
  exports: [CareRecordConditionRepositoryModule, CareRecordConditionService],
})
export class CareRecordConditionModule {}
