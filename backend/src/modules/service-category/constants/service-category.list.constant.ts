import { EnumServiceCategoryStatus } from '../enums/service-category.enum';

export const ServiceCategoryDefaultAvailableSearch = ['name'];
export const ServiceCategoryDefaultAvailableOrderBy = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const ServiceCategoryDefaultStatus = Object.values(
  EnumServiceCategoryStatus
);
