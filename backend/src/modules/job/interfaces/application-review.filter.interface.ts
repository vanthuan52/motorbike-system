import { Prisma } from '@/generated/prisma-client';

export type IApplicationReviewListFilters = Partial<
  Pick<Prisma.ApplicationReviewWhereInput, 'jobApplicationId'>
>;
