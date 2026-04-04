import { Prisma } from '@/generated/prisma-client';

export type IServiceChecklistListFilters = Partial<Pick<
    Prisma.ServiceChecklistWhereInput,
    'vehicleServiceId' | 'careAreaId' | 'vehicleType'
>>;
