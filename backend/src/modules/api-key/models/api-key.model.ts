import { EnumApiKeyType } from '../enums/api-key.enum';

export class ApiKeyModel {
  id: string;
  type: EnumApiKeyType;
  name: string;
  key: string;
  hash: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
