import { Module } from '@nestjs/common';
import { CareRecordServiceRepositoryModule } from './repository/care-record-service.repository.module';
import { CareRecordServiceService } from './services/care-record-service.service';
import { CareRecordServiceUtil } from './utils/care-record-service.util';
import { CareRecordChecklistModule } from '../care-record-checklist/care-record-checklist.module';

@Module({
  imports: [CareRecordServiceRepositoryModule, CareRecordChecklistModule],
  controllers: [],
  providers: [CareRecordServiceService, CareRecordServiceUtil],
  exports: [
    CareRecordServiceRepositoryModule,
    CareRecordServiceService,
    CareRecordServiceUtil,
  ],
})
export class CareRecordServiceModule {}
