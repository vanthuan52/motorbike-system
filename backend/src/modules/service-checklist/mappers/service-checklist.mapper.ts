import { ServiceChecklistModel } from '../models/service-checklist.model';
import { CareAreaMapper } from '@/modules/care-area/mappers/care-area.mapper';
import { VehicleServiceMapper } from '@/modules/vehicle-service/mappers/vehicle-service.mapper';
import { ServiceChecklist as PrismaServiceChecklist } from '@/generated/prisma-client';

// Include relations không được reflect trong Prisma base type
type PrismaServiceChecklistWithRelations = PrismaServiceChecklist & {
  careArea?: any;
  vehicleService?: any;
};

export class ServiceChecklistMapper {
  static toDomain(
    prismaChecklist: PrismaServiceChecklistWithRelations
  ): ServiceChecklistModel {
    const model = new ServiceChecklistModel();
    model.id = prismaChecklist.id;
    model.name = prismaChecklist.name;
    model.code = prismaChecklist.code;
    model.description = prismaChecklist.description ?? undefined;
    model.orderBy = prismaChecklist.orderBy;
    model.vehicleType = prismaChecklist.vehicleType;
    model.careAreaId = prismaChecklist.careAreaId;
    model.vehicleServiceId = prismaChecklist.vehicleServiceId ?? undefined;

    model.createdAt = prismaChecklist.createdAt;
    model.updatedAt = prismaChecklist.updatedAt;
    model.deletedAt = prismaChecklist.deletedAt ?? undefined;
    model.createdBy = prismaChecklist.createdBy ?? undefined;
    model.updatedBy = prismaChecklist.updatedBy ?? undefined;
    model.deletedBy = prismaChecklist.deletedBy ?? undefined;

    if (prismaChecklist.careArea) {
      model.careArea = CareAreaMapper.toDomain(prismaChecklist.careArea);
    }
    if (prismaChecklist.vehicleService) {
      model.vehicleService = VehicleServiceMapper.toDomain(
        prismaChecklist.vehicleService
      );
    }

    return model;
  }
}
