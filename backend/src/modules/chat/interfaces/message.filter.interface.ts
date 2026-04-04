import { Prisma } from '@/generated/prisma-client';

export type IMessageListFilters = Partial<Pick<
    Prisma.MessageWhereInput,
    'conversationId'
>>;
