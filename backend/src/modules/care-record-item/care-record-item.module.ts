import { Module } from '@nestjs/common';
import { CareRecordItemRepositoryModule } from './respository/care-record-item.repository.module';
import { CareRecordItemService } from './services/care-record-item.service';

@Module({
  imports: [CareRecordItemRepositoryModule],
  controllers: [],
  providers: [CareRecordItemService],
  exports: [CareRecordItemRepositoryModule, CareRecordItemService],
})
export class CareRecordItemModule {}
