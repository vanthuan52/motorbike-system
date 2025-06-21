import { faker } from '@faker-js/faker';
import { ENUM_USER_STATUS } from '../enums/user.enum';

interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}
export const UserDocParamsId: DocField[] = [
  {
    name: 'user',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const UserDocQueryRoleType: DocField[] = [
  {
    name: 'role',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: faker.string.uuid(),
    description: "value with ',' delimiter",
  },
];

export const UserDocQueryStatus: DocField[] = [
  {
    name: 'status',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(ENUM_USER_STATUS).join(','),
    description: "value with ',' delimiter",
  },
];
