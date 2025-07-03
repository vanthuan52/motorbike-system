import { faker } from '@faker-js/faker';
import { ENUM_SERVICE_PRICE_STATUS } from '../enums/service-price.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const ServicePriceDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const ServicePriceDocParamsSlug: DocField[] = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.internet.url(),
  },
];

export const ServicePriceDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_SERVICE_PRICE_STATUS).join(','),
    description: 'one value',
  },
];

export const ServicePriceDocQueryOrderBy: DocField[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const ServicePriceDocQueryOrderDirection: DocField[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const ServicePriceDocQueryServicePriceType: DocField[] = [
  {
    name: 'ServicePriceType',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const ServicePriceDocQueryVehicleBrand: DocField[] = [
  {
    name: 'vehicleBrand',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
