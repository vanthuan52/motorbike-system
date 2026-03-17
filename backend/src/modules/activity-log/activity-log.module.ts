import { Module } from '@nestjs/common';
import { ActivityLogRepositoryModule } from './repositories/activity-log.repository.module';
import { ActivityLogService } from './services/activity-log.service';
import { ActivityLogUtil } from './utils/activity-log.util';

@Module({
  imports: [ActivityLogRepositoryModule],
  controllers: [],
  providers: [ActivityLogService, ActivityLogUtil],
  exports: [ActivityLogService, ActivityLogUtil],
})
export class ActivityLogModule {}
