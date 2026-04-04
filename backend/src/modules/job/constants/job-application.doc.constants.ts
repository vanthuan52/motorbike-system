import { faker } from '@faker-js/faker';
import { EnumJobApplicationStatus } from '../enums/job.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const JobApplicationDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];
export const JobApplicationDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumJobApplicationStatus).join(','),
    description: "value with ',' delimiter",
  },
];

export const JobApplicationDocQueryJobId: DocField[] = [
  {
    name: 'jobId',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const JobApplicationDocQueryDate: DocField[] = [
  {
    name: 'appliedAtFrom',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: faker.date.anytime().toISOString(),
  },
  {
    name: 'appliedAtTo',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: faker.date.anytime().toISOString(),
  },
];
