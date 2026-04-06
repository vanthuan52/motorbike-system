import { Prisma } from '@/generated/prisma-client';

export type IVehicleModelListFilters = Partial<
  Pick<
    Prisma.VehicleModelWhereInput,
    | 'status'
    | 'type'
    | 'fuelType'
    | 'vehicleBrandId'
    | 'engineDisplacement'
    | 'modelYear'
  >
>;
