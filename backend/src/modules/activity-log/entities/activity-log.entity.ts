import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { EnumActivityLogAction } from '../enums/activity-log.enum';
import { UserEntity } from '@/modules/user/entities/user.entity';

export const ActivityLogTableName = 'activity_logs';

@DatabaseEntity({ collection: ActivityLogTableName })
export class ActivityLogEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: () => UserEntity.name,
    index: true,
  })
  user: string;

  @DatabaseProp({
    required: true,
    type: String,
    enum: EnumActivityLogAction,
    index: true,
  })
  action: EnumActivityLogAction;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 50,
  })
  ipAddress: string;

  @DatabaseProp({
    required: false,
    type: Object,
    default: null,
  })
  userAgent?: Record<string, any>;

  @DatabaseProp({
    required: false,
    type: Object,
    default: null,
  })
  metadata?: Record<string, any>;
}

export const ActivityLogSchema = DatabaseSchema(ActivityLogEntity);

export type ActivityLogDoc = IDatabaseDocument<ActivityLogEntity>;
