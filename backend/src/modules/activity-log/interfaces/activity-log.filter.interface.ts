import { Prisma } from '@/generated/prisma-client';

export type IActivityLogListFilters = Partial<
  Pick<Prisma.ActivityLogWhereInput, 'action' | 'userId'>
>;
