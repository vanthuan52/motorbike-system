import { Module } from '@nestjs/common';
import { CareAreaRepositoryModule } from './repository/care-area.repository.module';
import { CareAreaService } from './services/care-area.service';
import { CareAreaUtil } from './utils/care-area.util';
import { ServiceChecklistModule } from '@/modules/service-checklist/service-checklist.module';

@Module({
  imports: [CareAreaRepositoryModule, ServiceChecklistModule],
  controllers: [],
  providers: [CareAreaService, CareAreaUtil],
  exports: [CareAreaRepositoryModule, CareAreaService, CareAreaUtil],
})
export class CareAreaModule {}
