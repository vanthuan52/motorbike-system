import { Prisma } from '@/generated/prisma-client';

export interface IDatabaseOptions {
  tx?: Prisma.TransactionClient;
}
