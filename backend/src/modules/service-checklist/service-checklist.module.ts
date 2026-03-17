import { Module } from '@nestjs/common';
import { ServiceChecklistRepositoryModule } from './repository/service-checklist.repository.module';
import { ServiceChecklistService } from './services/service-checklist.service';
import { ServiceChecklistUtil } from './utils/service-checklist.util';

@Module({
  imports: [ServiceChecklistRepositoryModule],
  controllers: [],
  providers: [ServiceChecklistService, ServiceChecklistUtil],
  exports: [
    ServiceChecklistRepositoryModule,
    ServiceChecklistService,
    ServiceChecklistUtil,
  ],
})
export class ServiceChecklistModule {}
