import { Module } from '@nestjs/common';
import { CareRecordItemService } from './services/care-record-item.service';
import { CareRecordItemUtil } from './utils/care-record-item.util';

@Module({
  imports: [],
  controllers: [],
  providers: [CareRecordItemService, CareRecordItemUtil],
  exports: [CareRecordItemService, CareRecordItemUtil],
})
export class CareRecordItemModule {}
