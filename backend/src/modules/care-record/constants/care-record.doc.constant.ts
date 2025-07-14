import { faker } from '@faker-js/faker';
import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../enums/care-record.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const CareRecordDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const CareRecordDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_CARE_RECORD_STATUS).join(','),
    description: 'one value',
  },
];

export const CareRecordDocQueryPaymentStatus: DocField[] = [
  {
    name: 'paymentStatus',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_PAYMENT_STATUS).join(','),
    description: 'one value',
  },
];

export const CareRecordDocQueryOrderBy: DocField[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const CareRecordDocQueryOrderDirection: DocField[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const CareRecordDocQueryTechnician: DocField[] = [
  {
    name: 'technician',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const CareRecordDocQueryUserVehicle: DocField[] = [
  {
    name: 'userVehicle',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const CareRecordDocQueryAppointment: DocField[] = [
  {
    name: 'appointment',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
