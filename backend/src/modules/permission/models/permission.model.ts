import { EnumRoleType } from '../enums/permission.enum';

export class PermissionModel {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  type: EnumRoleType;
  abilities: any[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
