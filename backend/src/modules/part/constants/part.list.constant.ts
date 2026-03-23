import { EnumPartStatus } from '../enums/part.enum';

export const PART_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const PART_DEFAULT_AVAILABLE_ORDER_BY = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const PART_DEFAULT_STATUS = [
  EnumPartStatus.active,
  EnumPartStatus.inactive,
];
