import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  VehicleServiceDoc,
  VehicleServiceEntity,
} from '../entities/vehicle-service.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { ServiceCategoryEntity } from '@/modules/service-category/entities/service-category.entity';
import { ServiceChecklistEntity } from '@/modules/service-checklist/entities/service-checklist.entity';

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
    {
      path: 'checklistItems',
      localField: 'checklistItems',
      foreignField: '_id',
      model: ServiceChecklistEntity.name,
    },
  ];

  constructor(
    @InjectDatabaseModel(VehicleServiceEntity.name)
    private readonly vehicleServiceModel: Model<VehicleServiceEntity>,
  ) {
    super(vehicleServiceModel, [
      {
        path: 'serviceCategory',
        localField: 'serviceCategory',
        foreignField: '_id',
        model: ServiceCategoryEntity.name,
        justOne: true,
      },
      {
        path: 'checklistItems',
        localField: 'checklistItems',
        foreignField: '_id',
        model: ServiceChecklistEntity.name,
        select: '-createdAt -updatedAt -__v',
      },
    ]);
  }

  async findOneBySlug(slug: string): Promise<VehicleServiceDoc | null> {
    return this.vehicleServiceModel.findOne({ slug }).exec();
  }
}
