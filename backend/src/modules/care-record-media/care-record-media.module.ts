import { Module } from '@nestjs/common';
import { CareRecordMediaService } from './services/care-record-media.service';
import { CareRecordMediaRepository } from './respository/care-record-media.repository';
import { CareRecordMediaUtil } from './utils/care-record-media.util';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CareRecordMediaService,
    CareRecordMediaRepository,
    CareRecordMediaUtil,
  ],
  exports: [
    CareRecordMediaService,
    CareRecordMediaRepository,
    CareRecordMediaUtil,
  ],
})
export class CareRecordMediaModule {}
