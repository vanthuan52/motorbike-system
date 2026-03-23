import { CareAreaModel } from '../models/care-area.model';

export class CareAreaMapper {
  static toDomain(prismaArea: any): CareAreaModel {
    const model = new CareAreaModel();
    model.id = prismaArea.id;
    model.name = prismaArea.name;
    model.description = prismaArea.description;
    model.orderBy = prismaArea.order;

    model.createdAt = prismaArea.createdAt;
    model.updatedAt = prismaArea.updatedAt;
    model.deletedAt = prismaArea.deletedAt;
    model.createdBy = prismaArea.createdBy;
    model.updatedBy = prismaArea.updatedBy;
    model.deletedBy = prismaArea.deletedBy;

    return model;
  }
}
