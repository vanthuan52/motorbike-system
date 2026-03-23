import { ServicePriceModel } from '../models/service-price.model';

export class ServicePriceMapper {
  static toDomain(prismaPrice: any): ServicePriceModel {
    const model = new ServicePriceModel();
    model.id = prismaPrice.id;
    model.price = prismaPrice.price;
    model.vehicleServiceId = prismaPrice.vehicleServiceId;
    model.vehicleModelId = prismaPrice.vehicleModelId;
    model.dateStart = prismaPrice.dateStart;
    model.dateEnd = prismaPrice.dateEnd;

    model.createdAt = prismaPrice.createdAt;
    model.updatedAt = prismaPrice.updatedAt;
    model.deletedAt = prismaPrice.deletedAt;
    model.createdBy = prismaPrice.createdBy;
    model.updatedBy = prismaPrice.updatedBy;
    model.deletedBy = prismaPrice.deletedBy;

    return model;
  }
}
