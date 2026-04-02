import { Prisma } from '@/generated/prisma-client';

export type ISessionListFilters = Partial<Pick<
    Prisma.SessionWhereInput,
    'isRevoked'
>>;
