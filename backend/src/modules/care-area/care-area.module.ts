import { Module } from '@nestjs/common';
import { CareAreaRepositoryModule } from './repository/care-area.repository.module';
import { CareAreaService } from './services/care-area.service';
import { ServiceChecklistModule } from '@/modules/service-checklist/service-checklist.module';

@Module({
  imports: [CareAreaRepositoryModule, ServiceChecklistModule],
  controllers: [],
  providers: [CareAreaService],
  exports: [CareAreaRepositoryModule, CareAreaService],
})
export class CareAreaModule {}
