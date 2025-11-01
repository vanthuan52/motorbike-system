import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  AppointmentDoc,
  AppointmentEntity,
} from '../entities/appointment.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';

export class AppointmentRepository extends DatabaseRepositoryBase<
  AppointmentEntity,
  AppointmentDoc
> {
  readonly _joinVehicleServices: PopulateOptions = {
    path: 'vehicleServices',
    localField: 'vehicleServices',
    foreignField: '_id',
    model: VehicleServiceEntity.name,
  };

  // readonly _joinUser: PopulateOptions = {
  //   path: 'user',
  //   localField: 'user',
  //   foreignField: '_id',
  //   model: UserEntity.name,
  //   justOne: true,
  // };

  readonly _joinVehicleModel: PopulateOptions = {
    path: 'vehicleModel',
    localField: 'vehicleModel',
    foreignField: '_id',
    model: VehicleModelEntity.name,
    justOne: true,
  };

  readonly _joinActive: PopulateOptions[] = [
    // {
    //   path: 'user',
    //   localField: 'user',
    //   foreignField: '_id',
    //   model: UserEntity.name,
    //   justOne: true,
    // },
    {
      path: 'vehicleServices',
      localField: 'vehicleServices',
      foreignField: '_id',
      model: VehicleServiceEntity.name,
    },
    {
      path: 'vehicleModel',
      localField: 'vehicleModel',
      foreignField: '_id',
      model: VehicleModelEntity.name,
    },
  ];

  constructor(
    @InjectDatabaseModel(AppointmentEntity.name)
    private readonly appointmentModel: Model<AppointmentEntity>,
  ) {
    super(appointmentModel, [
      {
        path: 'vehicleServices',
        localField: 'vehicleServices',
        foreignField: '_id',
        model: VehicleServiceEntity.name,
      },
      // {
      //   path: 'user',
      //   localField: 'user',
      //   foreignField: '_id',
      //   model: UserEntity.name,
      //   justOne: true,
      // },
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
