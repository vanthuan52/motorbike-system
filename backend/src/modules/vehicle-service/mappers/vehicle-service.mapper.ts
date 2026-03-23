import { VehicleServiceModel } from '../models/vehicle-service.model';
import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class VehicleServiceMapper {
  static toDomain(prismaService: any): VehicleServiceModel {
    const model = new VehicleServiceModel();
    model.id = prismaService.id;
    model.name = prismaService.name;
    model.slug = prismaService.slug;
    model.description = prismaService.description;
    model.orderBy = prismaService.order;
    model.status = prismaService.status?.toLowerCase() as EnumStatus;
    model.photo = prismaService.photo;
    model.serviceCategoryId = prismaService.serviceCategoryId;

    model.createdAt = prismaService.createdAt;
    model.updatedAt = prismaService.updatedAt;
    model.deletedAt = prismaService.deletedAt;
    model.createdBy = prismaService.createdBy;
    model.updatedBy = prismaService.updatedBy;
    model.deletedBy = prismaService.deletedBy;

    return model;
  }
}
