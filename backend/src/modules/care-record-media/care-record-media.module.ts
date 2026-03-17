import { Module } from '@nestjs/common';
import { CareRecordMediaRepositoryModule } from './respository/care-record-media.repository.module';
import { CareRecordMediaService } from './services/care-record-media.service';
import { CareRecordMediaUtil } from './utils/care-record-media.util';

@Module({
  imports: [CareRecordMediaRepositoryModule],
  controllers: [],
  providers: [CareRecordMediaService, CareRecordMediaUtil],
  exports: [
    CareRecordMediaRepositoryModule,
    CareRecordMediaService,
    CareRecordMediaUtil,
  ],
})
export class CareRecordMediaModule {}
