import { ENUM_APPOINTMENTS_STATUS } from '../enums/appointment.enum';

export const APPOINTMENTS_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const APPOINTMENTS_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const APPOINTMENTS_DEFAULT_STATUS = Object.values(
  ENUM_APPOINTMENTS_STATUS,
);
