import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class PartTypeModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderBy: string;
  status: EnumStatus;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
