import { Module } from '@nestjs/common';
import { CareRecordConditionService } from './services/care-record-condition.service';
import { CareRecordConditionUtil } from './utils/care-record-condition.util';
import { CareRecordConditionRepository } from './repository/care-record-condition.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CareRecordConditionService,
    CareRecordConditionUtil,
    CareRecordConditionRepository,
  ],
  exports: [
    CareRecordConditionService,
    CareRecordConditionUtil,
    CareRecordConditionRepository,
  ],
})
export class CareRecordConditionModule {}
