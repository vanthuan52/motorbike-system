import { faker } from '@faker-js/faker';
import { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';
import { EnumPartStatus } from '../enums/part.enum';

export const PartDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const PartDocParamsSlug: ApiParamOptions[] = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.internet.url(),
  },
];

export const PartDocQueryStatus: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumPartStatus).join(','),
    description: 'one value',
  },
];

export const PartDocQueryOrderBy: ApiParamOptions[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const PartDocQueryOrderDirection: ApiParamOptions[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const PartDocQueryPartType: ApiParamOptions[] = [
  {
    name: 'partType',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const PartDocQueryVehicleBrand: ApiParamOptions[] = [
  {
    name: 'vehicleBrand',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const PartDocQueryList: ApiQueryOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumPartStatus).join(','),
    description: "value with ',' delimiter",
  },
  {
    name: 'vehicleBrand',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
  {
    name: 'partType',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
