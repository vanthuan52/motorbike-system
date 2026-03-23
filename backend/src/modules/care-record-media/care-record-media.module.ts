import { Module } from '@nestjs/common';
import { CareRecordMediaService } from './services/care-record-media.service';
import { CareRecordMediaUtil } from './utils/care-record-media.util';

@Module({
  imports: [],
  controllers: [],
  providers: [CareRecordMediaService, CareRecordMediaUtil],
  exports: [CareRecordMediaService, CareRecordMediaUtil],
})
export class CareRecordMediaModule {}
