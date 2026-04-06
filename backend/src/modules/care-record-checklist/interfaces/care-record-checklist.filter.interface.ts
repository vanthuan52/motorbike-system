import { Prisma } from '@/generated/prisma-client';

export type ICareRecordChecklistListFilters = Partial<
  Pick<
    Prisma.CareRecordChecklistWhereInput,
    'status' | 'result' | 'careRecordServiceId'
  >
>;
