import { Module } from '@nestjs/common';
import { ServiceChecklistAdminController } from './controllers/service-checklist.admin.controller';
import { ServiceChecklistService } from './services/service-checklist.service';
import { ServiceChecklistRepository } from './repository/service-checklist.repository';
import { ServiceChecklistUtil } from './utils/service-checklist.util';

@Module({
  imports: [],
  controllers: [ServiceChecklistAdminController],
  providers: [
    ServiceChecklistService,
    ServiceChecklistRepository,
    ServiceChecklistUtil,
  ],
  exports: [
    ServiceChecklistService,
    ServiceChecklistRepository,
    ServiceChecklistUtil,
  ],
})
export class ServiceChecklistModule {}
