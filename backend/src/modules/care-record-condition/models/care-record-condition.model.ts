import {
  EnumBodyCondition,
  EnumExhaustCoverCondition,
  EnumMirrorCondition,
  EnumOilLevel,
  EnumSeatCondition,
} from '../enums/care-record-condition.enum';
import { CareRecordModel } from '@/modules/care-record/models/care-record.model';

/**
 * Domain model representing the initial condition assessment of a vehicle.
 * Maps from Prisma CareRecordCondition to application domain layer.
 */
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
  careRecord?: CareRecordModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<CareRecordConditionModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
