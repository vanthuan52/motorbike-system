import { ActivityLogModel } from '../models/activity-log.model';
import { User } from '@/generated/prisma-client';

export interface IActivityLog extends ActivityLogModel {
  user?: User;
}

export type IActivityLogMetadata = Record<string, string | number | Date>;
