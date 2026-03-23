import { EnumVehicleModelType, EnumVehicleModelFuelType } from '../enums/vehicle-model.enum';
import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

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

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
