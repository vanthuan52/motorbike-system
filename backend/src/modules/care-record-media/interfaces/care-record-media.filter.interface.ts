import { Prisma } from '@/generated/prisma-client';

export type ICareRecordMediaListFilters = Partial<
  Pick<Prisma.CareRecordMediaWhereInput, 'careRecordId'>
>;
