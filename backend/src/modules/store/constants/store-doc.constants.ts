import { faker } from '@faker-js/faker';
import { ENUM_STORE_STATUS } from '../enums/store.enum';
import { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';

export const StoreDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const StoreDocParamsSlug: ApiParamOptions[] = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: 'cua-hang',
  },
];

export const StoreDocQueryStatus: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_STORE_STATUS).join(','),
    description: "value with ',' delimiter",
  },
];

export const StoreDocQueryList: ApiQueryOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_STORE_STATUS).join(','),
    description: "value with ',' delimiter",
  },
];
