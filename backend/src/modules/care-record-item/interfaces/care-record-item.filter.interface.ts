import { Prisma } from '@/generated/prisma-client';

export type ICareRecordItemListFilters = Partial<Pick<
    Prisma.CareRecordItemWhereInput,
    'careRecordId'
>>;
