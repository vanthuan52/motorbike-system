import { StoreModel } from '../models/store.model';
import { EnumStoreStatus } from '../enums/store.enum';
import { Prisma, Store as PrismaStore } from '@/generated/prisma-client';

export class StoreMapper {
  static toDomain(prismaStore: PrismaStore): StoreModel {
    return new StoreModel({
      id: prismaStore.id,
      name: prismaStore.name,
      address: prismaStore.address,
      workHours: prismaStore.workHours,
      description: prismaStore.description || undefined,
      slug: prismaStore.slug,
      status: prismaStore.status as EnumStoreStatus,

      createdAt: prismaStore.createdAt,
      updatedAt: prismaStore.updatedAt,
      deletedAt: prismaStore.deletedAt || undefined,
      createdBy: prismaStore.createdBy || undefined,
      updatedBy: prismaStore.updatedBy || undefined,
      deletedBy: prismaStore.deletedBy || undefined,
    });
  }

  /**
   * Chuyển từ Model sang dữ liệu để Update DB
   * Loại bỏ các trường không được phép update thủ công như id, createdAt
   */
  static toPersistence(model: StoreModel): Prisma.StoreUpdateInput {
    return {
      name: model.name,
      address: model.address,
      workHours: model.workHours,
      description: model.description,
      slug: model.slug,
      status: model.status as any,
      updatedBy: model.updatedBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
    };
  }
}
