import { faker } from '@faker-js/faker';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const MessageDocParamsId: DocField[] = [
  {
    name: 'conversationId',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const MessageDocParamsIdMessageId: DocField[] = [
  {
    name: 'messageId',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];
