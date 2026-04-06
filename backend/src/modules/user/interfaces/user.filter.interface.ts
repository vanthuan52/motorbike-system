import { Prisma } from '@/generated/prisma-client';

export type IUserListFilters = Partial<
  Pick<Prisma.UserWhereInput, 'status' | 'role'>
>;
