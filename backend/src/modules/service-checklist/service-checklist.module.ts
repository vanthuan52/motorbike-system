import { Module } from '@nestjs/common';
import { ServiceChecklistRepositoryModule } from './repository/service-checklist.repository.module';
import { ServiceChecklistService } from './services/service-checklist.service';

@Module({
  imports: [ServiceChecklistRepositoryModule],
  controllers: [],
  providers: [ServiceChecklistService],
  exports: [ServiceChecklistRepositoryModule, ServiceChecklistService],
})
export class ServiceChecklistModule {}
