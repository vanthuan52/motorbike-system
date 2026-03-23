import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';

export class VehicleBrandModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderBy: string;
  country?: string;
  status: EnumVehicleBrandStatus;
  photo?: any;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
