import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { ActivityLogDto } from '../dtos/activity-log.dto';
import {
  ActivityLogDoc,
  ActivityLogEntity,
} from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogUtil {
  mapList(
    activityLogs: ActivityLogDoc[] | ActivityLogEntity[],
  ): ActivityLogDto[] {
    return plainToInstance(
      ActivityLogDto,
      activityLogs.map((a: ActivityLogDoc | ActivityLogEntity) =>
        a instanceof Document ? a.toObject() : a,
      ),
    );
  }

  mapOne(activityLog: ActivityLogDoc | ActivityLogEntity): ActivityLogDto {
    return plainToInstance(
      ActivityLogDto,
      activityLog instanceof Document ? activityLog.toObject() : activityLog,
    );
  }
}
