import { PasswordHistoryModel } from '../models/password-history.model';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import {
  PasswordHistory as PrismaPasswordHistory,
  User as PrismaUser,
} from '@/generated/prisma-client';

export class PasswordHistoryMapper {
  static toDomain(
    raw: PrismaPasswordHistory & { user?: PrismaUser }
  ): PasswordHistoryModel {
    const domain = new PasswordHistoryModel({
      id: raw.id,
      userId: raw.userId,
      password: raw.password,
      type: raw.type as any,
      expiredAt: raw.expiredAt,

      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt || undefined,

      createdBy: raw.createdBy || undefined,
      updatedBy: raw.updatedBy || undefined,
      deletedBy: raw.deletedBy || undefined,
    });

    if (raw.user) {
      domain.user = UserMapper.toDomain(raw.user);
    }

    return domain;
  }
}
