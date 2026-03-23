import { EnumAppointmentStatus } from '../enums/appointment.enum';

export const APPOINTMENTS_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const APPOINTMENTS_DEFAULT_AVAILABLE_ORDER_BY = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const APPOINTMENTS_DEFAULT_STATUS = Object.values(
  EnumAppointmentStatus,
);
