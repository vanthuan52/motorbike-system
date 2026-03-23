import { CareRecordChecklistModel } from '../models/care-record-checklist.model';
import { EnumCareRecordChecklistResult, EnumCareRecordChecklistStatus } from '../enums/care-record-checklist.enum';

export class CareRecordChecklistMapper {
  static toDomain(prismaChecklist: any): CareRecordChecklistModel {
    const model = new CareRecordChecklistModel();
    model.id = prismaChecklist.id;
    model.name = prismaChecklist.name;
    const resultMap: Record<string, EnumCareRecordChecklistResult> = {
      UNCHECKED: EnumCareRecordChecklistResult.unchecked,
      CHECKED: EnumCareRecordChecklistResult.checked,
      REPLACED: EnumCareRecordChecklistResult.replaced,
      SKIPPED: EnumCareRecordChecklistResult.skipped,
    };
    model.result = resultMap[prismaChecklist.result] || EnumCareRecordChecklistResult.unchecked;
    const statusMap: Record<string, EnumCareRecordChecklistStatus> = {
      PENDING: EnumCareRecordChecklistStatus.pending,
      IN_PROGRESS: EnumCareRecordChecklistStatus.inProgress,
      COMPLETED: EnumCareRecordChecklistStatus.completed,
    };
    model.status = statusMap[prismaChecklist.status] || EnumCareRecordChecklistStatus.pending;
    model.note = prismaChecklist.note;
    model.wearPercentage = prismaChecklist.wearPercentage;
    model.imageBefore = prismaChecklist.imageBefore;
    model.imageAfter = prismaChecklist.imageAfter;
    model.careRecordServiceId = prismaChecklist.careRecordServiceId;
    model.serviceChecklistId = prismaChecklist.serviceChecklistId;

    model.createdAt = prismaChecklist.createdAt;
    model.updatedAt = prismaChecklist.updatedAt;
    model.deletedAt = prismaChecklist.deletedAt;
    model.createdBy = prismaChecklist.createdBy;
    model.updatedBy = prismaChecklist.updatedBy;
    model.deletedBy = prismaChecklist.deletedBy;

    return model;
  }
}
