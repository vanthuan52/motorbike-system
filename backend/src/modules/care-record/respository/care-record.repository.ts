import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  CareRecordDoc,
  CareRecordEntity,
} from '../entities/care-record.entity';
import { AppointmentEntity } from '@/modules/appointment/entities/appointment.entity';
import { UserVehicleEntity } from '@/modules/user-vehicle/entities/user-vehicle.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';

export class CareRecordRepository extends DatabaseRepositoryBase<
  CareRecordEntity,
  CareRecordDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'appointment',
      localField: 'appointment',
      foreignField: '_id',
      model: AppointmentEntity.name,
      justOne: true,
    },
    {
      path: 'technician',
      localField: 'technician',
      foreignField: '_id',
      model: UserEntity.name,
      justOne: true,
    },
    {
      path: 'userVehicle',
      localField: 'userVehicle',
      foreignField: '_id',
      model: UserVehicleEntity.name,
      justOne: true,
    },
  ];

  constructor(
    @InjectDatabaseModel(CareRecordEntity.name)
    private readonly careRecordModel: Model<CareRecordEntity>,
  ) {
    super(careRecordModel, [
      {
        path: 'appointment',
        localField: 'appointment',
        foreignField: '_id',
        model: AppointmentEntity.name,
        justOne: true,
      },
      {
        path: 'technician',
        localField: 'technician',
        foreignField: '_id',
        model: UserEntity.name,
        justOne: true,
      },
      {
        path: 'userVehicle',
        localField: 'userVehicle',
        foreignField: '_id',
        model: UserVehicleEntity.name,
        justOne: true,
      },
    ]);
  }
}
