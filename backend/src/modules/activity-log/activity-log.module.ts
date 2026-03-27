import { Global, Module } from '@nestjs/common';
import { ActivityLogRepository } from './repository/activity-log.repository';
import { ActivityLogService } from '@/modules/activity-log/services/activity-log.service';
import { ActivityLogUtil } from '@/modules/activity-log/utils/activity-log.util';

@Global()
@Module({
  controllers: [],
  providers: [ActivityLogService, ActivityLogRepository, ActivityLogUtil],
  exports: [ActivityLogService, ActivityLogRepository, ActivityLogUtil],
  imports: [],
})
export class ActivityLogModule {}
