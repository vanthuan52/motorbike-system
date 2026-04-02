import { CareRecordServiceModel } from '../models/care-record-service.model';
import {
  EnumCareRecordServiceStatus,
  EnumCareRecordServiceType,
} from '../enums/care-record-service.enum';
import { CareRecordMapper } from '@/modules/care-record/mappers/care-record.mapper';
import { VehicleServiceMapper } from '@/modules/vehicle-service/mappers/vehicle-service.mapper';
import { CareRecordChecklistMapper } from '@/modules/care-record-checklist/mappers/care-record-checklist.mapper';

export class CareRecordServiceMapper {
  static toDomain(prismaService: any): CareRecordServiceModel {
    const model = new CareRecordServiceModel();
    model.id = prismaService.id;
    model.name = prismaService.name;
    model.status = prismaService.status as EnumCareRecordServiceStatus;
    model.type = prismaService.type as EnumCareRecordServiceType;
    model.careRecordId = prismaService.careRecordId;
    model.vehicleServiceId = prismaService.vehicleServiceId;

    model.createdAt = prismaService.createdAt;
    model.updatedAt = prismaService.updatedAt;
    model.deletedAt = prismaService.deletedAt;
    model.createdBy = prismaService.createdBy;
    model.updatedBy = prismaService.updatedBy;
    model.deletedBy = prismaService.deletedBy;

    if (prismaService.careRecord) {
      model.careRecord = CareRecordMapper.toDomain(prismaService.careRecord);
    }
    if (prismaService.vehicleService) {
      model.vehicleService = VehicleServiceMapper.toDomain(
        prismaService.vehicleService
      );
    }
    if (
      prismaService.careRecordChecklists &&
      Array.isArray(prismaService.careRecordChecklists)
    ) {
      model.careRecordChecklists = prismaService.careRecordChecklists.map(
        (c: any) => CareRecordChecklistMapper.toDomain(c)
      );
    }

    return model;
  }
}
