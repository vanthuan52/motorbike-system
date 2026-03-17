import { faker } from '@faker-js/faker';
import { ApiParamOptions } from '@nestjs/swagger';

export const SessionDocParamsId: ApiParamOptions[] = [
  {
    name: 'session',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];
