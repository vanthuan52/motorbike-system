import { ENUM_PART_STATUS } from '../enums/part.enum';

export const PART_DEFAULT_AVAILABLE_SEARCH = ['name', 'code'];
export const PART_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const PART_DEFAULT_STATUS = [
  ENUM_PART_STATUS.ACTIVE,
  ENUM_PART_STATUS.INACTIVE,
];
