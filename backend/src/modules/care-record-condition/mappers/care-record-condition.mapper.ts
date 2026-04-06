import { CareRecordConditionModel } from '../models/care-record-condition.model';
import {
  EnumBodyCondition,
  EnumExhaustCoverCondition,
  EnumMirrorCondition,
  EnumOilLevel,
  EnumSeatCondition,
} from '../enums/care-record-condition.enum';
import { CareRecordMapper } from '@/modules/care-record/mappers/care-record.mapper';
import { CareRecordCondition as PrismaCareRecordCondition } from '@/generated/prisma-client';

export class CareRecordConditionMapper {
  static toDomain(
    prismaCondition: PrismaCareRecordCondition
  ): CareRecordConditionModel {
    const model = new CareRecordConditionModel();
    model.id = prismaCondition.id;
    model.odoKm = prismaCondition.odoKm;
    model.odoKmFaulty = prismaCondition.odoKmFaulty;
    model.fuelLevelPercent = prismaCondition.fuelLevelPercent;
    model.fuelLevelFaulty = prismaCondition.fuelLevelFaulty;
    model.engineOilLevel = prismaCondition.engineOilLevel as EnumOilLevel;
    model.rearviewMirrorCondition =
      prismaCondition.rearviewMirrorCondition as EnumMirrorCondition;
    model.seatCondition = prismaCondition.seatCondition as EnumSeatCondition;
    model.bodyCondition = prismaCondition.bodyCondition as EnumBodyCondition;
    model.exhaustCoverCondition =
      prismaCondition.exhaustCoverCondition as EnumExhaustCoverCondition;
    model.hasLuggageRack = prismaCondition.hasLuggageRack;
    model.hasFootMat = prismaCondition.hasFootMat;
    model.careRecordId = prismaCondition.careRecordId;

    model.createdAt = prismaCondition.createdAt;
    model.updatedAt = prismaCondition.updatedAt;
    model.deletedAt = prismaCondition.deletedAt;
    model.createdBy = prismaCondition.createdBy;
    model.updatedBy = prismaCondition.updatedBy;
    model.deletedBy = prismaCondition.deletedBy;

    if (prismaCondition.careRecord) {
      model.careRecord = CareRecordMapper.toDomain(prismaCondition.careRecord);
    }

    return model;
  }
}
