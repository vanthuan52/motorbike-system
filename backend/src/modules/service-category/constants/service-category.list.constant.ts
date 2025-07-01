import { ENUM_SERVICE_CATEGORY_STATUS } from '../enums/service-category.enum';

export const SERVICE_CATEGORY_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const SERVICE_CATEGORY_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const SERVICE_CATEGORY_DEFAULT_STATUS = Object.values(
  ENUM_SERVICE_CATEGORY_STATUS,
);
