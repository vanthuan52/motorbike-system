import { Prisma } from '@/generated/prisma-client';

export type IVehicleBrandListFilters = Partial<Pick<
    Prisma.VehicleBrandWhereInput,
    'status'
>>;
