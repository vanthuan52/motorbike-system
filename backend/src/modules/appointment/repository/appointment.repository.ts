import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  AppointmentsDoc,
  AppointmentsEntity,
} from '../entities/appointment.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { ServiceCategoryEntity } from '@/modules/service-category/entities/service-category.entity';
import { VehicleBrandEntity } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';

export class AppointmentsRepository extends DatabaseRepositoryBase<
  AppointmentsEntity,
  AppointmentsDoc
> {
  readonly _joinServiceCategory: PopulateOptions = {
    path: 'vehicleServices',
    model: ServiceCategoryEntity.name,
    justOne: false,
    match: { isActive: true },
  };

  readonly _joinVehicleModel: PopulateOptions = {
    path: 'vehicleModel',
    model: VehicleModelEntity.name,
    justOne: true,
    match: { isActive: true },
  };

  constructor(
    @InjectDatabaseModel(AppointmentsEntity.name)
    private readonly AppointmentsModel: Model<AppointmentsEntity>,
  ) {
    super(AppointmentsModel, [
      {
        path: 'vehicleServices',
        model: ServiceCategoryEntity.name,
        justOne: false,
      },
      {
        path: 'vehicleModel',
        model: VehicleModelEntity.name,
        justOne: true,
      },
    ]);
  }
}
