import { faker } from '@faker-js/faker';
import { ENUM_HIRING_STATUS, ENUM_HIRING_TYPE } from '../enums/hiring.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const HiringDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const HiringDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_HIRING_STATUS).join(','),
    description: "value with ',' delimiter",
  },
];

export const HiringDocQueryHiringType: DocField[] = [
  {
    name: 'jobType',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_HIRING_TYPE).join(','),
    description: "value with ',' delimiter",
  },
];
