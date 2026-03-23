import { faker } from '@faker-js/faker';
import { ApiParamOptions } from '@nestjs/swagger';
import { EnumServiceCategoryStatus } from '../enums/service-category.enum';

export const ServiceCategoryDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const ServiceCategoryDocParamsSlug: ApiParamOptions[] = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.internet.url(),
  },
];

export const ServiceCategoryDocQueryStatus: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumServiceCategoryStatus).join(','),
    description: "value with ',' delimiter",
  },
];

export const ServiceCategoryDocQueryOrderBy: ApiParamOptions[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'orderBy',
    description: 'Arrange the position sorting by orderBy field',
  },
];

export const ServiceCategoryDocQueryOrderDirection: ApiParamOptions[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by orderBy field',
  },
];
