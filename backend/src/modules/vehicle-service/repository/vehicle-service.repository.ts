import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  VehicleServiceDoc,
  VehicleServiceEntity,
} from '../entities/vehicle-service.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { ServiceCategoryEntity } from '@/modules/service-category/entities/service-category.entity';

export class VehicleServiceRepository extends DatabaseRepositoryBase<
  VehicleServiceEntity,
  VehicleServiceDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'serviceCategory',
      localField: 'serviceCategory',
      foreignField: '_id',
      model: ServiceCategoryEntity.name,
      justOne: true,
      match: {
        isActive: true,
      },
    },
  ];

  constructor(
    @InjectDatabaseModel(VehicleServiceEntity.name)
    private readonly VehicleServiceModel: Model<VehicleServiceEntity>,
  ) {
    super(VehicleServiceModel, [
      {
        path: 'serviceCategory',
        localField: 'serviceCategory',
        foreignField: '_id',
        model: ServiceCategoryEntity.name,
        justOne: true,
      },
    ]);
  }

  async findOneBySlug(slug: string): Promise<VehicleServiceDoc | null> {
    return this.VehicleServiceModel.findOne({ slug }).exec();
  }
}
