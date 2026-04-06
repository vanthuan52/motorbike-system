import { Prisma } from '@/generated/prisma-client';

export type IServiceCategoryListFilters = Partial<
  Pick<Prisma.ServiceCategoryWhereInput, 'status'>
>;
