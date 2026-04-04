import { EnumPartTypeStatus } from '../enums/part-type.enum';
import { PartTypeModel } from '../models/part-type.model';

export class PartTypeMapper {
  static toDomain(prismaPartType: any): PartTypeModel {
    const model = new PartTypeModel();
    model.id = prismaPartType.id;
    model.name = prismaPartType.name;
    model.slug = prismaPartType.slug;
    model.description = prismaPartType.description;
    model.orderBy = prismaPartType.order;
    model.status = prismaPartType.status as EnumPartTypeStatus;
    model.photoCdnUrl = prismaPartType.photoCdnUrl ?? undefined;

    model.createdAt = prismaPartType.createdAt;
    model.updatedAt = prismaPartType.updatedAt;
    model.deletedAt = prismaPartType.deletedAt;
    model.createdBy = prismaPartType.createdBy;
    model.updatedBy = prismaPartType.updatedBy;
    model.deletedBy = prismaPartType.deletedBy;

    return model;
  }
}
