import { faker } from '@faker-js/faker';
import { ENUM_CARE_RECORD_MEDIA_STAGE } from '../enums/care-record-media.enum';
import { ENUM_FILE_MIME } from '@/common/file/enums/file.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const CareRecordMediaDocParamsId: DocField[] = [
  {
    name: 'id',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const CareRecordMediaDocQueryStage: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_CARE_RECORD_MEDIA_STAGE).join(','),
    description: 'one value',
  },
];

export const CareRecordMediaDocQueryType: DocField[] = [
  {
    name: 'type',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_FILE_MIME).join(','),
    description: 'one value',
  },
];

export const CareRecordMediaDocQueryCareRecord: DocField[] = [
  {
    name: 'careRecord',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '',
    description: faker.string.uuid(),
  },
];
