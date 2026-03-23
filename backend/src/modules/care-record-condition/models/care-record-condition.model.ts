import { 
  EnumOilLevel, 
  EnumMirrorCondition, 
  EnumSeatCondition, 
  EnumBodyCondition, 
  EnumExhaustCoverCondition 
} from '../enums/care-record-condition.enum';

export class CareRecordConditionModel {
  id: string;
  odoKm?: number;
  odoKmFaulty: boolean;
  fuelLevelPercent?: number;
  fuelLevelFaulty: boolean;
  engineOilLevel: EnumOilLevel;
  rearviewMirrorCondition: EnumMirrorCondition;
  seatCondition: EnumSeatCondition;
  bodyCondition: EnumBodyCondition;
  exhaustCoverCondition: EnumExhaustCoverCondition;
  hasLuggageRack: boolean;
  hasFootMat: boolean;
  careRecordId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
