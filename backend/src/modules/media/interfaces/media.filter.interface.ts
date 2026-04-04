import { Prisma } from '@/generated/prisma-client';

export type IMediaListFilters = Partial<Pick<
    Prisma.MediaWhereInput,
    'type' | 'mimeType'
>>;
