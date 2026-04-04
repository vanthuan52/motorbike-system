import { faker } from '@faker-js/faker';
import { EnumJobStatus, EnumJobType } from '../enums/job.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const JobDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const JobDocParamsSlug: DocField[] = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: 'tho-sua-xe-may',
  },
];

export const JobDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumJobStatus).join(','),
    description: "value with ',' delimiter",
  },
];

export const JobDocQueryJobType: DocField[] = [
  {
    name: 'jobType',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumJobType).join(','),
    description: "value with ',' delimiter",
  },
];
