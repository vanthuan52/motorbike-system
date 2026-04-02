import { Prisma } from '@/generated/prisma-client';

export type IPartListFilters = Partial<Pick<
    Prisma.PartWhereInput,
    'status' | 'partTypeId' | 'vehicleBrandId'
>>;
