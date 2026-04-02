import { ActivityLogModel } from '../models/activity-log.model';
import { UserModel } from '@/modules/user/models/user.model';

export interface IActivityLog extends ActivityLogModel {
  user?: UserModel;
}

export type IActivityLogMetadata = Record<string, string | number | Date>;
