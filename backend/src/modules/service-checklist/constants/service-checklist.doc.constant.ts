import { faker } from '@faker-js/faker';
import { ApiParamOptions } from '@nestjs/swagger';

export const ServiceChecklistDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const ServiceChecklistDocParamsCode: ApiParamOptions[] = [
  {
    name: 'code',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.internet.url(),
  },
];

export const ServiceChecklistDocQueryOrderBy: ApiParamOptions[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const ServiceChecklistDocQueryOrderDirection: ApiParamOptions[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];
