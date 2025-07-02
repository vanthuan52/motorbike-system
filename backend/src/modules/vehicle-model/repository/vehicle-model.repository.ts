import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  VehicleModelDoc,
  VehicleModelEntity,
} from '../entities/vehicle-model.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { VehicleBrandEntity } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';

export class VehicleModelRepository extends DatabaseRepositoryBase<
  VehicleModelEntity,
  VehicleModelDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'vehicleBrand',
      localField: 'vehicleBrand',
      foreignField: '_id',
      model: VehicleBrandEntity.name,
      justOne: true,
      match: {
        isActive: true,
      },
    },
  ];

  constructor(
    @InjectDatabaseModel(VehicleModelEntity.name)
    private readonly vehicleModelModel: Model<VehicleModelEntity>,
  ) {
    super(vehicleModelModel, [
      {
        path: 'vehicleBrand',
        localField: 'vehicleBrand',
        foreignField: '_id',
        model: VehicleBrandEntity.name,
        justOne: true,
      },
    ]);
  }

  async findOneBySlug(slug: string): Promise<VehicleModelDoc | null> {
    return this.vehicleModelModel.findOne({ slug }).exec();
  }
}
