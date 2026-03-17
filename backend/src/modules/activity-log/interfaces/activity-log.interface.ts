import {
  ActivityLogDoc,
  ActivityLogEntity,
} from '../entities/activity-log.entity';
import { UserDoc, UserEntity } from '@/modules/user/entities/user.entity';

export interface IActivityLogEntity extends Omit<ActivityLogEntity, 'user'> {
  user?: UserEntity;
}

export interface IActivityLogDoc extends Omit<ActivityLogDoc, 'user'> {
  user?: UserDoc;
}

export type IActivityLogMetadata = Record<string, string | number | Date>;
