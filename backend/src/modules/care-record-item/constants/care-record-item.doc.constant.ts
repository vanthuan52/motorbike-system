import { faker } from '@faker-js/faker';
import { ApiParamOptions } from '@nestjs/swagger';

export const CareRecordItemDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const CareRecordItemDocQueryCareRecord: ApiParamOptions[] = [
  {
    name: 'careRecord',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: faker.string.uuid(),
  },
];
