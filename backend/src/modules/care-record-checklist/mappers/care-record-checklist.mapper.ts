import { CareRecordChecklistModel } from '../models/care-record-checklist.model';
import {
  EnumCareRecordChecklistResult,
  EnumCareRecordChecklistStatus,
} from '../enums/care-record-checklist.enum';
import { CareRecordServiceMapper } from '@/modules/care-record-service/mappers/care-record-service.mapper';
import { ServiceChecklistMapper } from '@/modules/service-checklist/mappers/service-checklist.mapper';
import {
  CareRecordChecklist as PrismaCareRecordChecklist,
  CareRecordService as PrismaCareRecordService,
  ServiceChecklist as PrismaServiceChecklist,
} from '@/generated/prisma-client';

type CareRecordChecklistWithRelations = PrismaCareRecordChecklist & {
  careRecordService?: PrismaCareRecordService | null;
  serviceChecklist?: PrismaServiceChecklist | null;
};

export class CareRecordChecklistMapper {
  static toDomain(
    prismaChecklist: CareRecordChecklistWithRelations
  ): CareRecordChecklistModel {
    const model = new CareRecordChecklistModel();
    model.id = prismaChecklist.id;
    model.name = prismaChecklist.name;
    model.result = prismaChecklist.result as EnumCareRecordChecklistResult;
    model.status = prismaChecklist.status as EnumCareRecordChecklistStatus;
    model.note = prismaChecklist.note;
    model.wearPercentage = prismaChecklist.wearPercentage;
    model.imageBeforeCdnUrl = prismaChecklist.imageBeforeCdnUrl ?? undefined;
    model.imageAfterCdnUrl = prismaChecklist.imageAfterCdnUrl ?? undefined;
    model.careRecordServiceId = prismaChecklist.careRecordServiceId;
    model.serviceChecklistId = prismaChecklist.serviceChecklistId;

    model.createdAt = prismaChecklist.createdAt;
    model.updatedAt = prismaChecklist.updatedAt;
    model.deletedAt = prismaChecklist.deletedAt;
    model.createdBy = prismaChecklist.createdBy;
    model.updatedBy = prismaChecklist.updatedBy;
    model.deletedBy = prismaChecklist.deletedBy;

    if (prismaChecklist.careRecordService) {
      model.careRecordService = CareRecordServiceMapper.toDomain(
        prismaChecklist.careRecordService
      );
    }
    if (prismaChecklist.serviceChecklist) {
      model.serviceChecklist = ServiceChecklistMapper.toDomain(
        prismaChecklist.serviceChecklist
      );
    }

    return model;
  }
}
