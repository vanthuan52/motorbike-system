import { EnumServiceCategoryStatus } from '../enums/service-category.enum';

export const SERVICE_CATEGORY_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const SERVICE_CATEGORY_DEFAULT_AVAILABLE_ORDER_BY = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const SERVICE_CATEGORY_DEFAULT_STATUS = Object.values(
  EnumServiceCategoryStatus,
);
