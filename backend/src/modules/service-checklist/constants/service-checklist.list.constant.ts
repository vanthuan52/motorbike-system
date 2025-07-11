import { ENUM_SERVICE_CHECKLIST_AREA } from '../enums/service-checklist.enum';

export const SERVICE_CHECKLIST_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const SERVICE_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const SERVICE_CHECKLIST_DEFAULT_AREA = Object.values(
  ENUM_SERVICE_CHECKLIST_AREA,
);
