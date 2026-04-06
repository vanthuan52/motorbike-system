import { Prisma } from '@/generated/prisma-client';

export type ICareRecordConditionListFilters = Partial<
  Pick<Prisma.CareRecordConditionWhereInput, 'careRecordId'>
>;
