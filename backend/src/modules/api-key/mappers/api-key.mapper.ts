import { ApiKeyModel } from '../models/api-key.model';
import { EnumApiKeyType } from '../enums/api-key.enum';
import { ApiKey as PrismaApiKey } from '@/generated/prisma-client';

export class ApiKeyMapper {
  static toDomain(prismaApiKey: PrismaApiKey): ApiKeyModel {
    const model = new ApiKeyModel();
    model.id = prismaApiKey.id;
    model.type = prismaApiKey.type as EnumApiKeyType;
    model.name = prismaApiKey.name;
    model.key = prismaApiKey.key;
    model.hash = prismaApiKey.hash;
    model.isActive = prismaApiKey.isActive;

    model.createdAt = prismaApiKey.createdAt;
    model.updatedAt = prismaApiKey.updatedAt;
    model.deletedAt = prismaApiKey.deletedAt;
    model.createdBy = prismaApiKey.createdBy;
    model.updatedBy = prismaApiKey.updatedBy;
    model.deletedBy = prismaApiKey.deletedBy;

    return model;
  }
}
