export class ServicePriceModel {
  id: string;
  price: number;
  vehicleServiceId: string;
  vehicleModelId: string;
  dateStart: Date;
  dateEnd?: Date;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
