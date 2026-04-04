import { Prisma } from '@/generated/prisma-client';

export type IJobApplicationListFilters = Partial<Pick<
    Prisma.JobApplicationWhereInput,
    'status' | 'jobId' | 'appliedAt'
>>;
