import { faker } from '@faker-js/faker';
import { ApiParamOptions } from '@nestjs/swagger';
import { EnumCareRecordServiceStatus } from '../enums/care-record-service.enum';

export const CareRecordServiceDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const CareRecordServiceDocQueryStatus: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumCareRecordServiceStatus).join(','),
    description: 'one value',
  },
];

export const CareRecordServiceDocQueryCareRecord: ApiParamOptions[] = [
  {
    name: 'careRecord',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: faker.string.uuid(),
  },
];
