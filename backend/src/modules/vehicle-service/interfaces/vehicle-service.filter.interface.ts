import { Prisma } from '@/generated/prisma-client';

export type IVehicleServiceListFilters = Partial<
  Pick<Prisma.VehicleServiceWhereInput, 'status' | 'serviceCategoryId'>
>;
