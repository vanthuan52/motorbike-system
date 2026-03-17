import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IDatabaseCreateOptions } from '@/common/database/interfaces/database.interface';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  ActivityLogDoc,
  ActivityLogEntity,
} from '../entities/activity-log.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { EnumActivityLogAction } from '../enums/activity-log.enum';
import { IRequestLog } from '@/common/request/interfaces/request.interface';

@Injectable()
export class ActivityLogRepository extends DatabaseRepositoryBase<
  ActivityLogEntity,
  ActivityLogDoc
> {
  constructor(
    @InjectDatabaseModel(ActivityLogEntity.name)
    private readonly activityLogModel: Model<ActivityLogEntity>,
  ) {
    super(activityLogModel);
  }

  async createLog(
    user: string,
    action: EnumActivityLogAction,
    { ipAddress, userAgent }: IRequestLog,
    metadata?: Record<string, any>,
    options?: IDatabaseCreateOptions,
  ): Promise<ActivityLogDoc> {
    const entity = new ActivityLogEntity();
    entity.user = user;
    entity.action = action;
    entity.ipAddress = ipAddress;
    entity.userAgent = userAgent;
    entity.metadata = metadata;

    return this.create(entity, options);
  }
}
