import { Module } from '@nestjs/common';
import { CareRecordItemService } from './services/care-record-item.service';
import { CareRecordItemUtil } from './utils/care-record-item.util';
import { CareRecordItemRepository } from './repository/care-record-item.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CareRecordItemService,
    CareRecordItemUtil,
    CareRecordItemRepository,
  ],
  exports: [
    CareRecordItemService,
    CareRecordItemUtil,
    CareRecordItemRepository,
  ],
})
export class CareRecordItemModule {}
