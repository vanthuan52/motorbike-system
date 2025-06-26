import { faker } from '@faker-js/faker';
import { ENUM_STORE_STATUS } from '../enums/store.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const StoreDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const StoreDocParamsSlug: DocField[] = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: 'cua-hang',
  },
];

export const StoreDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_STORE_STATUS).join(','),
    description: "value with ',' delimiter",
  },
];
