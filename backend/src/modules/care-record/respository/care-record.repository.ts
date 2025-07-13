import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  CareRecordDoc,
  CareRecordEntity,
} from '../entities/care-record.entity';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';

export class CareRecordRepository extends DatabaseRepositoryBase<
  CareRecordEntity,
  CareRecordDoc
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
    @InjectDatabaseModel(CareRecordEntity.name)
    private readonly CareRecordModel: Model<CareRecordEntity>,
  ) {
    super(CareRecordModel, [
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

  async findOneBySlug(slug: string): Promise<CareRecordDoc | null> {
    return this.CareRecordModel.findOne({ slug }).exec();
  }
}
