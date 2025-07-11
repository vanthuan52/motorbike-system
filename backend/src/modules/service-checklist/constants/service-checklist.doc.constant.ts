import { faker } from '@faker-js/faker';
import { ENUM_SERVICE_CHECKLIST_AREA } from '../enums/service-checklist.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const ServiceChecklistDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const ServiceChecklistDocParamsCode: DocField[] = [
  {
    name: 'code',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.internet.url(),
  },
];

export const ServiceChecklistDocQueryArea: DocField[] = [
  {
    name: 'area',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_SERVICE_CHECKLIST_AREA).join(','),
    description: 'one value',
  },
];

export const ServiceChecklistDocQueryOrderBy: DocField[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const ServiceChecklistDocQueryOrderDirection: DocField[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];
