import { Prisma } from '@/generated/prisma-client';

export type IApiKeyListFilters = Partial<
  Pick<Prisma.ApiKeyWhereInput, 'isActive' | 'type'>
>;
