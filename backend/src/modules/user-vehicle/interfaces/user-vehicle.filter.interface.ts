import { Prisma } from '@/generated/prisma-client';

export type IUserVehicleListFilters = Partial<Pick<
    Prisma.UserVehicleWhereInput,
    'userId' | 'vehicleModelId'
>>;
