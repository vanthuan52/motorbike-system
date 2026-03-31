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
  vehicleModelId: string;

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
