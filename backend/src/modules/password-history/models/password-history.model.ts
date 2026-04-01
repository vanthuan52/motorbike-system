import { UserModel } from '@/modules/user/models/user.model';
import { EnumPasswordHistoryType } from '@/generated/prisma-client';

export class PasswordHistoryModel {
  id: string;
  userId: string;
  password?: string;
  type: EnumPasswordHistoryType;
  expiredAt: Date;

  user?: UserModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<PasswordHistoryModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
