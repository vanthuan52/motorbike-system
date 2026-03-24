import { faker } from '@faker-js/faker';
import { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';
import { EnumRoleType } from '@/generated/prisma-client';

export const PermissionDocParamsId: ApiParamOptions[] = [
  {
    name: 'permissionId',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  },
];

export const PermissionDocQueryList: ApiQueryOptions[] = [
  {
    name: 'type',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: Object.values(EnumRoleType).join(','),
    description: `enum value with ',' delimiter. Available values: ${Object.values(EnumRoleType).join(',')}`,
  },
];
