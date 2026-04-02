import { EnumAppointmentStatus } from '../enums/appointment.enum';

export const AppointmentDefaultAvailableSearch = [
  'code',
  'customerName',
  'customerPhone',
];
export const AppointmentDefaultAvailableOrderBy = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const AppointmentDefaultStatus = Object.values(EnumAppointmentStatus);
