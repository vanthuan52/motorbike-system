import { ServicePriceModel } from '../models/service-price.model';
import { VehicleServiceMapper } from '@/modules/vehicle-service/mappers/vehicle-service.mapper';
import { VehicleModelMapper } from '@/modules/vehicle-model/mappers/vehicle-model.mapper';
import { ServicePrice as PrismaServicePrice } from '@/generated/prisma-client';

export class ServicePriceMapper {
  static toDomain(prismaPrice: PrismaServicePrice | any): ServicePriceModel {
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

    if (prismaPrice.vehicleService) {
      model.vehicleService = VehicleServiceMapper.toDomain(
        prismaPrice.vehicleService
      );
    }
    if (prismaPrice.vehicleModel) {
      model.vehicleModel = VehicleModelMapper.toDomain(
        prismaPrice.vehicleModel
      );
    }

    return model;
  }
}
