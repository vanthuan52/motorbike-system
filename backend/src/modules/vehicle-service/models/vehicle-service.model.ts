import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class VehicleServiceModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderBy: string;
  status: EnumStatus;
  photo?: string;
  serviceCategoryId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
