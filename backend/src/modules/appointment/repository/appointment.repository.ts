import { Model, PipelineStage, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  AppointmentDoc,
  AppointmentEntity,
} from '../entities/appointment.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  VehicleServiceEntity,
  VehicleServiceTableName,
} from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';
import { IAppointmentDoc } from '../interfaces/appointment.interface';
import { IDatabaseGetTotalOptions } from '@/common/database/interfaces/database.interface';

export class AppointmentRepository extends DatabaseRepositoryBase<
  AppointmentEntity,
  AppointmentDoc
> {
  readonly _joinVehicleServices: PopulateOptions = {
    path: 'vehicleServices',
    localField: 'vehicleServices',
    foreignField: '_id',
    model: VehicleServiceEntity.name,
    justOne: true,
  };

  readonly _joinVehicleModel: PopulateOptions = {
    path: 'vehicleModel',
    localField: 'vehicleModel',
    foreignField: '_id',
    model: VehicleModelEntity.name,
    justOne: true,
  };

  readonly _joinActive: PopulateOptions[] = [];

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
      {
        path: 'vehicleModel',
        localField: 'vehicleModel',
        foreignField: '_id',
        model: VehicleModelEntity.name,
        justOne: true,
      },
    ]);
  }

  createRawQueryFindAllWithVehicleService(
    find?: Record<string, any>,
  ): PipelineStage[] {
    return [
      {
        $lookup: {
          from: VehicleServiceTableName,
          as: 'vehicleService',
          foreignField: '_id',
          localField: 'vehicleService',
        },
      },
      {
        $unwind: '$VehicleService',
      },
      {
        $match: find as {},
      },
    ];
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.getTotal(find, options);
  }
}
