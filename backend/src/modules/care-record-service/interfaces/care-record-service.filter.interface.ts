import { Prisma } from '@/generated/prisma-client';

export type ICareRecordServiceListFilters = Partial<Pick<
    Prisma.CareRecordServiceWhereInput,
    'status' | 'careRecordId'
>>;
