import { VehicleBrandModel } from '@/modules/vehicle-brand/models/vehicle-brand.model';
import {
  EnumVehicleModelType,
  EnumVehicleModelFuelType,
} from '../enums/vehicle-model.enum';
import { EnumStatus } from '@/common/enums/common.enum';

/**
 * Domain model representing a vehicle model (e.g., Honda Wave RSX).
 * Maps from Prisma VehicleModel to application domain layer.
 */
export class VehicleModelModel {
  id: string;
  name: string;
  fullName?: string;
  slug: string;
  description?: string;
  engineDisplacement?: number;
  modelYear?: number;
  type: EnumVehicleModelType;
  fuelType: EnumVehicleModelFuelType;
  status: EnumStatus;
  orderBy: string;
  yearStart?: number;
  yearEnd?: number;
  photo?: string;

  vehicleBrandId: string;
  vehicleBrand?: VehicleBrandModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<VehicleModelModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
