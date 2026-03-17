import { Module } from '@nestjs/common';
import { CareRecordConditionRepositoryModule } from './repository/care-record-condition.repository.module';
import { CareRecordConditionService } from './services/care-record-condition.service';
import { CareRecordConditionUtil } from './utils/care-record-condition.util';
import { CareRecordRepositoryModule } from '../care-record/respository/care-record.repository.module';

@Module({
  imports: [CareRecordConditionRepositoryModule, CareRecordRepositoryModule],
  controllers: [],
  providers: [CareRecordConditionService, CareRecordConditionUtil],
  exports: [
    CareRecordConditionRepositoryModule,
    CareRecordConditionService,
    CareRecordConditionUtil,
  ],
})
export class CareRecordConditionModule {}
