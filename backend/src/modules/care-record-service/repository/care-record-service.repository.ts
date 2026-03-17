import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  CareRecordServiceDoc,
  CareRecordServiceEntity,
} from '../entities/care-record-service.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';

export class CareRecordServiceRepository extends DatabaseRepositoryBase<
  CareRecordServiceEntity,
  CareRecordServiceDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    // {
    //   path: 'careRecord',
    //   localField: 'careRecord',
    //   foreignField: '_id',
    //   model: CareRecordEntity.name,
    //   justOne: true,
    // },
    {
      path: 'vehicleService',
      localField: 'vehicleService',
      foreignField: '_id',
      model: VehicleServiceEntity.name,
      justOne: true,
    },
  ];

  constructor(
    @InjectDatabaseModel(CareRecordServiceEntity.name)
    private readonly careRecordServiceModel: Model<CareRecordServiceEntity>,
  ) {
    super(careRecordServiceModel, [
      // {
      //   path: 'careRecord',
      //   localField: 'careRecord',
      //   foreignField: '_id',
      //   model: CareRecordEntity.name,
      //   justOne: true,
      // },
      {
        path: 'vehicleService',
        localField: 'vehicleService',
        foreignField: '_id',
        model: VehicleServiceEntity.name,
        justOne: true,
      },
    ]);
  }
}
