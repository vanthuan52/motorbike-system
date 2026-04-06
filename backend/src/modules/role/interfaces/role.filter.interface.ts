import { Prisma } from '@/generated/prisma-client';

export type IRoleListFilters = Partial<Pick<Prisma.RoleWhereInput, 'type'>>;
