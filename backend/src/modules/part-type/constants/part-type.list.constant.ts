import { EnumPartTypeStatus } from '../enums/part-type.enum';

export const PartTypeDefaultAvailableSearch = ['name'];
export const PartTypeDefaultAvailableOrderBy = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const PartTypeDefaultStatus = Object.values(EnumPartTypeStatus);

