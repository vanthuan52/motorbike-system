import { Module } from '@nestjs/common';
import { CareAreaService } from './services/care-area.service';
import { CareAreaUtil } from './utils/care-area.util';
import { ServiceChecklistModule } from '@/modules/service-checklist/service-checklist.module';
import { CareAreaRepository } from './repository/care-area.repository';

@Module({
  imports: [ServiceChecklistModule],
  controllers: [],
  providers: [CareAreaService, CareAreaUtil, CareAreaRepository],
  exports: [CareAreaService, CareAreaUtil, CareAreaRepository],
})
export class CareAreaModule {}
