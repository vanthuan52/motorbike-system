import { Module } from '@nestjs/common';
import { ServiceChecklistService } from './services/service-checklist.service';
import { ServiceChecklistUtil } from './utils/service-checklist.util';

@Module({
  imports: [],
  controllers: [],
  providers: [ServiceChecklistService, ServiceChecklistUtil],
  exports: [ServiceChecklistService, ServiceChecklistUtil],
})
export class ServiceChecklistModule {}
