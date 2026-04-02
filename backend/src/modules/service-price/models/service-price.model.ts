import { VehicleServiceModel } from '@/modules/vehicle-service/models/vehicle-service.model';
import { VehicleModelModel } from '@/modules/vehicle-model/models/vehicle-model.model';

/**
 * Domain model representing a service price entry.
 * Maps from Prisma ServicePrice to application domain layer.
 */
export class ServicePriceModel {
  id: string;
  price: number;
  dateStart: Date;
  dateEnd?: Date;

  vehicleServiceId: string;
  vehicleService?: VehicleServiceModel;
  vehicleModelId: string;
  vehicleModel?: VehicleModelModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<ServicePriceModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
