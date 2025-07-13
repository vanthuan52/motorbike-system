import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  UserVehicleDoc,
  UserVehicleEntity,
} from '../entities/user-vehicle.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';

export class UserVehicleRepository extends DatabaseRepositoryBase<
  UserVehicleEntity,
  UserVehicleDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'vehicleModel',
      localField: 'vehicleModel',
      foreignField: '_id',
      model: VehicleModelEntity.name,
      justOne: true,
    },
  ];

  constructor(
    @InjectDatabaseModel(UserVehicleEntity.name)
    private readonly userVehicleModel: Model<UserVehicleEntity>,
  ) {
    super(userVehicleModel, [
      {
        path: 'vehicleModel',
        localField: 'vehicleModel',
        foreignField: '_id',
        model: VehicleModelEntity.name,
        justOne: true,
      },
    ]);
  }
}
