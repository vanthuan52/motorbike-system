import { ENUM_PART_TYPE_STATUS } from '../enums/part-type.enum';

export const PART_TYPE_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const PART_TYPE_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const PART_TYPE_DEFAULT_STATUS = Object.values(ENUM_PART_TYPE_STATUS);
