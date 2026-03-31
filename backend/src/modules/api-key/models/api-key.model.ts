import { EnumApiKeyType } from '../enums/api-key.enum';

/**
 * Domain model representing an API key.
 * Maps from Prisma ApiKey to application domain layer.
 */
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

  constructor(data?: Partial<ApiKeyModel>) {
    Object.assign(this, data);
  }

  isActiveAndNotDeleted(): boolean {
    return this.isActive && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
