import { EnumRoleType } from '@generated/prisma-client';

export interface IPermission {
  id: string;
  type: EnumRoleType;
  name: string;
}
