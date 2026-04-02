import { PartTypeModel } from '../models/part-type.model';
import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class PartTypeMapper {
  static toDomain(prismaPartType: any): PartTypeModel {
    const model = new PartTypeModel();
    model.id = prismaPartType.id;
    model.name = prismaPartType.name;
    model.slug = prismaPartType.slug;
    model.description = prismaPartType.description;
    model.orderBy = prismaPartType.order;
    model.status = prismaPartType.status as EnumStatus;

    model.createdAt = prismaPartType.createdAt;
    model.updatedAt = prismaPartType.updatedAt;
    model.deletedAt = prismaPartType.deletedAt;
    model.createdBy = prismaPartType.createdBy;
    model.updatedBy = prismaPartType.updatedBy;
    model.deletedBy = prismaPartType.deletedBy;

    return model;
  }
}
