import { faker } from '@faker-js/faker';
import { ApiParamOptions } from '@nestjs/swagger';
import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../enums/care-record.enum';

export const CareRecordDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const CareRecordDocQueryStatus: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_CARE_RECORD_STATUS).join(','),
    description: 'one value',
  },
];

export const CareRecordDocQueryPaymentStatus: ApiParamOptions[] = [
  {
    name: 'paymentStatus',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_PAYMENT_STATUS).join(','),
    description: 'one value',
  },
];

export const CareRecordDocQueryOrderBy: ApiParamOptions[] = [
  {
    name: 'orderBy',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'order',
    description: 'Arrange the position sorting by order field',
  },
];

export const CareRecordDocQueryOrderDirection: ApiParamOptions[] = [
  {
    name: 'orderDirection',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'asc',
    description: 'Arrange the position sorting by order field',
  },
];

export const CareRecordDocQueryTechnician: ApiParamOptions[] = [
  {
    name: 'technician',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const CareRecordDocQueryUserVehicle: ApiParamOptions[] = [
  {
    name: 'userVehicle',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];

export const CareRecordDocQueryAppointment: ApiParamOptions[] = [
  {
    name: 'appointment',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
