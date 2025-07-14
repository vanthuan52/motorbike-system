import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  CareRecordMediaDoc,
  CareRecordMediaEntity,
} from '../entities/care-record-media.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';

export class CareRecordMediaRepository extends DatabaseRepositoryBase<
  CareRecordMediaEntity,
  CareRecordMediaDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'careRecord',
      localField: 'careRecord',
      foreignField: '_id',
      model: CareRecordEntity.name,
      justOne: true,
    },
  ];

  constructor(
    @InjectDatabaseModel(CareRecordMediaEntity.name)
    private readonly careRecordMediaModel: Model<CareRecordMediaEntity>,
  ) {
    super(careRecordMediaModel, [
      {
        path: 'careRecord',
        localField: 'careRecord',
        foreignField: '_id',
        model: CareRecordEntity.name,
        justOne: true,
      },
    ]);
  }
}
