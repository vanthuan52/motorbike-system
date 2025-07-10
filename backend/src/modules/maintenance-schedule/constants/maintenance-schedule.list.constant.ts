import { ENUM_MAINTENANCE_SCHEDULE_STATUS } from '../enums/maintenance-schedule.enum';

export const MAINTENANCE_SCHEDULE_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const MAINTENANCE_SCHEDULE_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const MAINTENANCE_SCHEDULE_DEFAULT_STATUS = Object.values(
  ENUM_MAINTENANCE_SCHEDULE_STATUS,
);
