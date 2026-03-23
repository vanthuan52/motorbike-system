import { PartModel } from '../models/part.model';
import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class PartMapper {
  static toDomain(prismaPart: any): PartModel {
    const model = new PartModel();
    model.id = prismaPart.id;
    model.name = prismaPart.name;
    model.slug = prismaPart.slug;
    model.description = prismaPart.description;
    model.status = prismaPart.status?.toLowerCase() as EnumStatus;
    model.orderBy = prismaPart.order;
    model.partTypeId = prismaPart.partTypeId;
    model.vehicleBrandId = prismaPart.vehicleBrandId;

    model.createdAt = prismaPart.createdAt;
    model.updatedAt = prismaPart.updatedAt;
    model.deletedAt = prismaPart.deletedAt;
    model.createdBy = prismaPart.createdBy;
    model.updatedBy = prismaPart.updatedBy;
    model.deletedBy = prismaPart.deletedBy;

    return model;
  }
}
