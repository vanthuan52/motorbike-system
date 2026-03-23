import { Module } from '@nestjs/common';
import { CareRecordConditionService } from './services/care-record-condition.service';
import { CareRecordConditionUtil } from './utils/care-record-condition.util';

@Module({
  imports: [],
  controllers: [],
  providers: [CareRecordConditionService, CareRecordConditionUtil],
  exports: [CareRecordConditionService, CareRecordConditionUtil],
})
export class CareRecordConditionModule {}
