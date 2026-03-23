import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class StoreModel {
  id: string;
  name: string;
  address: string;
  workHours: string;
  description?: string;
  slug: string;
  status: EnumStatus;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
