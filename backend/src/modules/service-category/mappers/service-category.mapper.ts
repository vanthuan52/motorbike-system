import { ServiceCategoryModel } from '../models/service-category.model';
import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class ServiceCategoryMapper {
  static toDomain(prismaCategory: any): ServiceCategoryModel {
    const model = new ServiceCategoryModel();
    model.id = prismaCategory.id;
    model.name = prismaCategory.name;
    model.slug = prismaCategory.slug;
    model.description = prismaCategory.description;
    model.orderBy = prismaCategory.order;
    model.status = prismaCategory.status as EnumStatus;

    model.createdAt = prismaCategory.createdAt;
    model.updatedAt = prismaCategory.updatedAt;
    model.deletedAt = prismaCategory.deletedAt;
    model.createdBy = prismaCategory.createdBy;
    model.updatedBy = prismaCategory.updatedBy;
    model.deletedBy = prismaCategory.deletedBy;

    return model;
  }
}
