import { Prisma } from '@/generated/prisma-client';

export type IJobListFilters = Partial<
  Pick<Prisma.JobWhereInput, 'status' | 'jobType'>
>;
