import { faker } from '@faker-js/faker';
import { ApiParamOptions } from '@nestjs/swagger';
import { EnumCareRecordMediaStage } from '../enums/care-record-media.enum';
import { EnumFileExtension } from '@/common/file/enums/file.enum';

export const CareRecordMediaDocParamsId: ApiParamOptions[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const CareRecordMediaDocQueryStage: ApiParamOptions[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumCareRecordMediaStage).join(','),
    description: 'one value',
  },
];

export const CareRecordMediaDocQueryType: ApiParamOptions[] = [
  {
    name: 'type',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumFileExtension).join(','),
    description: 'one value',
  },
];

export const CareRecordMediaDocQueryCareRecord: ApiParamOptions[] = [
  {
    name: 'careRecord',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
