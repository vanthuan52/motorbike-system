import { ServiceChecklistModel } from '../models/service-checklist.model';
import { CareAreaMapper } from '@/modules/care-area/mappers/care-area.mapper';
import { VehicleServiceMapper } from '@/modules/vehicle-service/mappers/vehicle-service.mapper';

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
    model.vehicleServiceId = prismaChecklist.vehicleServiceId;

    model.createdAt = prismaChecklist.createdAt;
    model.updatedAt = prismaChecklist.updatedAt;
    model.deletedAt = prismaChecklist.deletedAt;
    model.createdBy = prismaChecklist.createdBy;
    model.updatedBy = prismaChecklist.updatedBy;
    model.deletedBy = prismaChecklist.deletedBy;

    if (prismaChecklist.careArea) {
      model.careArea = CareAreaMapper.toDomain(prismaChecklist.careArea);
    }
    if (prismaChecklist.vehicleService) {
      model.vehicleService = VehicleServiceMapper.toDomain(prismaChecklist.vehicleService);
    }

    return model;
  }
}
