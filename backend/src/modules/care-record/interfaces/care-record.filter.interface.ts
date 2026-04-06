import { Prisma } from '@/generated/prisma-client';

export type ICareRecordListFilters = Partial<
  Pick<
    Prisma.CareRecordWhereInput,
    | 'status'
    | 'paymentStatus'
    | 'appointmentId'
    | 'technicianId'
    | 'userVehicleId'
  >
>;
