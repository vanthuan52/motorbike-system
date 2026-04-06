import { Prisma } from '@/generated/prisma-client';

export type IAppointmentListFilters = Partial<
  Pick<Prisma.AppointmentWhereInput, 'status' | 'isActive'>
>;
