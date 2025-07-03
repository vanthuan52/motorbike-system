import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  ServicePriceDoc,
  ServicePriceEntity,
} from '../entities/service-price.entity';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';

export class ServicePriceRepository extends DatabaseRepositoryBase<
  ServicePriceEntity,
  ServicePriceDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'vehicleService',
      localField: 'vehicleService',
      foreignField: '_id',
      model: VehicleServiceEntity.name,
      justOne: true,
      match: {
        isActive: true,
      },
    },
    {
      path: 'vehicleModel',
      localField: 'vehicleModel',
      foreignField: '_id',
      model: VehicleModelEntity.name,
      justOne: true,
      match: {
        isActive: true,
      },
    },
  ];

  constructor(
    @InjectDatabaseModel(ServicePriceEntity.name)
    private readonly ServicePriceModel: Model<ServicePriceEntity>,
  ) {
    super(ServicePriceModel, [
      {
        path: 'vehicleService',
        localField: 'vehicleService',
        foreignField: '_id',
        model: VehicleServiceEntity.name,
        justOne: true,
      },
      {
        path: 'vehicleModel',
        localField: 'vehicleModel',
        foreignField: '_id',
        model: VehicleModelEntity.name,
        justOne: true,
      },
    ]);
  }

  async findOneBySlug(slug: string): Promise<ServicePriceDoc | null> {
    return this.ServicePriceModel.findOne({ slug }).exec();
  }
}
