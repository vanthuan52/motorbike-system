import { StoreModel } from '../models/store.model';
import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class StoreMapper {
  static toDomain(prismaStore: any): StoreModel {
    const model = new StoreModel();
    model.id = prismaStore.id;
    model.name = prismaStore.name;
    model.address = prismaStore.address;
    model.workHours = prismaStore.workHours;
    model.description = prismaStore.description;
    model.slug = prismaStore.slug;
    model.status = prismaStore.status?.toLowerCase() as EnumStatus;

    model.createdAt = prismaStore.createdAt;
    model.updatedAt = prismaStore.updatedAt;
    model.deletedAt = prismaStore.deletedAt;
    model.createdBy = prismaStore.createdBy;
    model.updatedBy = prismaStore.updatedBy;
    model.deletedBy = prismaStore.deletedBy;

    return model;
  }
}
