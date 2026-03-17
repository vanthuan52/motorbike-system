import { Module } from '@nestjs/common';
import { CareRecordItemRepositoryModule } from './respository/care-record-item.repository.module';
import { CareRecordItemService } from './services/care-record-item.service';
import { CareRecordItemUtil } from './utils/care-record-item.util';

@Module({
  imports: [CareRecordItemRepositoryModule],
  controllers: [],
  providers: [CareRecordItemService, CareRecordItemUtil],
  exports: [
    CareRecordItemRepositoryModule,
    CareRecordItemService,
    CareRecordItemUtil,
  ],
})
export class CareRecordItemModule {}
