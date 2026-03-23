import { CareRecordServiceModel } from '../models/care-record-service.model';
import { EnumCareRecordServiceStatus, EnumCareRecordServiceType } from '../enums/care-record-service.enum';

export class CareRecordServiceMapper {
  static toDomain(prismaService: any): CareRecordServiceModel {
    const model = new CareRecordServiceModel();
    model.id = prismaService.id;
    model.name = prismaService.name;
    model.status = prismaService.status?.toLowerCase() as EnumCareRecordServiceStatus;
    model.type = prismaService.type?.toLowerCase() as EnumCareRecordServiceType;
    model.careRecordId = prismaService.careRecordId;
    model.vehicleServiceId = prismaService.vehicleServiceId;

    model.createdAt = prismaService.createdAt;
    model.updatedAt = prismaService.updatedAt;
    model.deletedAt = prismaService.deletedAt;
    model.createdBy = prismaService.createdBy;
    model.updatedBy = prismaService.updatedBy;
    model.deletedBy = prismaService.deletedBy;

    return model;
  }
}
