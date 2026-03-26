import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ActivityLogResponseDto } from '@/modules/activity-log/dtos/response/activity-log.response.dto';
import { ActivityLogModel } from '../models/activity-log.model';

@Injectable()
export class ActivityLogUtil {
  mapList(activityLogs: ActivityLogModel[]): ActivityLogResponseDto[] {
    return plainToInstance(ActivityLogResponseDto, activityLogs);
  }
}
