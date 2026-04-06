import { Prisma } from '@/generated/prisma-client';

export type IServicePriceListFilters = Partial<
  Pick<
    Prisma.ServicePriceWhereInput,
    'vehicleServiceId' | 'vehicleModelId' | 'isActive'
  >
>;
