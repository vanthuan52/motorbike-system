import { faker } from '@faker-js/faker';
import {
  EnumCareRecordChecklistResult,
  EnumCareRecordChecklistStatus,
} from '../enums/care-record-checklist.enum';
import { ApiParamOptions } from '@nestjs/swagger';

export const CareRecordChecklistDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const CareRecordChecklistDocQueryStatus: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumCareRecordChecklistStatus).join(','),
    description: 'one value',
  },
];

export const CareRecordChecklistDocQueryResult: ApiParamOptions[] = [
  {
    name: 'result',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumCareRecordChecklistResult).join(','),
    description: 'one value',
  },
];

export const CareRecordChecklistDocQueryCareRecordService: ApiParamOptions[] = [
  {
    name: 'careRecordService',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: faker.string.uuid(),
  },
];
