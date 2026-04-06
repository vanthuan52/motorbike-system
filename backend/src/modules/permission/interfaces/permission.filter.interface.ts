import { Prisma } from '@/generated/prisma-client';

export type IPermissionListFilters = Partial<
  Pick<Prisma.PermissionWhereInput, 'group'>
>;
