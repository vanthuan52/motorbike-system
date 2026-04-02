import { Prisma } from '@/generated/prisma-client';

export type IPartTypeListFilters = Partial<Pick<
    Prisma.PartTypeWhereInput,
    'status'
>>;
