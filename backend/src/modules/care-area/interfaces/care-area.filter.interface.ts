import { Prisma } from '@/generated/prisma-client';

export type ICareAreaListFilters = Partial<Pick<
    Prisma.CareAreaWhereInput,
    'storeId'
>>;
