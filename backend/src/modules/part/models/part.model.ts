import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class PartModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: EnumStatus;
  orderBy: string;
  partTypeId: string;
  vehicleBrandId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
