import { EnumRoleType } from '../enums/role.enum';

export class RoleModel {
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
