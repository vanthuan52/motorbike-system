import { VehicleServiceModel } from '../models/vehicle-service.model';
import { ServiceCategoryMapper } from '@/modules/service-category/mappers/service-category.mapper';

export class VehicleServiceMapper {
  static toDomain(prismaService: any): VehicleServiceModel {
    const model = new VehicleServiceModel();
    model.id = prismaService.id;
    model.name = prismaService.name;
    model.slug = prismaService.slug;
    model.description = prismaService.description;
    model.orderBy = prismaService.order;
    model.status = prismaService.status;
    model.photo = prismaService.photo;
    model.serviceCategoryId = prismaService.serviceCategoryId;

    model.createdAt = prismaService.createdAt;
    model.updatedAt = prismaService.updatedAt;
    model.deletedAt = prismaService.deletedAt;
    model.createdBy = prismaService.createdBy;
    model.updatedBy = prismaService.updatedBy;
    model.deletedBy = prismaService.deletedBy;

    if (prismaService.serviceCategory) {
      model.serviceCategory = ServiceCategoryMapper.toDomain(
        prismaService.serviceCategory
      );
    }

    return model;
  }
}
