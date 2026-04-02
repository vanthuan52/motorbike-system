import { Prisma } from '@/generated/prisma-client';

export type IStoreListFilters = Partial<Pick<
    Prisma.StoreWhereInput,
    'status'
>>;
