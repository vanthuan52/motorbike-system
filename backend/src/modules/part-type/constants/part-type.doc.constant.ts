import { faker } from '@faker-js/faker';
import { EnumPartTypeStatus } from '../enums/part-type.enum';
import { ApiParamOptions } from '@nestjs/swagger';

export const PartTypeDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const PartTypeDocParamsSlug: ApiParamOptions[] = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.internet.url(),
  },
];

export const PartTypeDocQueryStatus: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumPartTypeStatus).join(','),
    description: "value with ',' delimiter",
  },
];

export const PartTypeDocQueryOrderBy: ApiParamOptions[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const PartTypeDocQueryOrderDirection: ApiParamOptions[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const PartTypeDocQueryList: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumPartTypeStatus).join(','),
    description: "value with ',' delimiter",
  },
];
