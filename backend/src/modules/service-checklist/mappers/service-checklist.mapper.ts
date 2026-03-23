import { ServiceChecklistModel } from '../models/service-checklist.model';

export class ServiceChecklistMapper {
  static toDomain(prismaChecklist: any): ServiceChecklistModel {
    const model = new ServiceChecklistModel();
    model.id = prismaChecklist.id;
    model.name = prismaChecklist.name;
    model.code = prismaChecklist.code;
    model.description = prismaChecklist.description;
    model.orderBy = prismaChecklist.order;
    model.vehicleType = prismaChecklist.vehicleType;
    model.careAreaId = prismaChecklist.careAreaId;

    model.createdAt = prismaChecklist.createdAt;
    model.updatedAt = prismaChecklist.updatedAt;
    model.deletedAt = prismaChecklist.deletedAt;
    model.createdBy = prismaChecklist.createdBy;
    model.updatedBy = prismaChecklist.updatedBy;
    model.deletedBy = prismaChecklist.deletedBy;

    return model;
  }
}
