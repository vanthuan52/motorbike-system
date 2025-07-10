import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  MaintenanceScheduleDoc,
  MaintenanceScheduleEntity,
} from '../entities/maintenance-schedule.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { ServiceCategoryEntity } from '@/modules/service-category/entities/service-category.entity';
import { VehicleBrandEntity } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';

export class MaintenanceScheduleRepository extends DatabaseRepositoryBase<
  MaintenanceScheduleEntity,
  MaintenanceScheduleDoc
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
  readonly _joinVehicleBrand: PopulateOptions = {
    path: 'vehicleBrand',
    localField: 'vehicleBrand',
    foreignField: '_id',
    model: VehicleBrandEntity.name,
    justOne: true,
    match: {
      isActive: true,
    },
  };

  readonly _joinVehicleModel: PopulateOptions = {
    path: 'vehicleModel',
    localField: 'vehicleModel',
    foreignField: '_id',
    model: VehicleModelEntity.name,
    justOne: true,
    match: {
      isActive: true,
    },
  };
  constructor(
    @InjectDatabaseModel(MaintenanceScheduleEntity.name)
    private readonly MaintenanceScheduleModel: Model<MaintenanceScheduleEntity>,
  ) {
    super(MaintenanceScheduleModel, [
      {
        path: 'serviceCategory',
        localField: 'serviceCategory',
        foreignField: '_id',
        model: ServiceCategoryEntity.name,
        justOne: true,
      },
      {
        path: 'vehicleModel',
        localField: 'vehicleModel',
        foreignField: '_id',
        model: VehicleModelEntity.name,
        justOne: true,
      },
      {
        path: 'vehicleBrand',
        localField: 'vehicleBrand',
        foreignField: '_id',
        model: VehicleBrandEntity.name,
        justOne: true,
      },
    ]);
  }
}
