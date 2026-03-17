import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  CareRecordConditionDoc,
  CareRecordConditionEntity,
} from '../entities/care-record-condition.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';

export class CareRecordConditionRepository extends DatabaseRepositoryBase<
  CareRecordConditionEntity,
  CareRecordConditionDoc
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
    @InjectDatabaseModel(CareRecordConditionEntity.name)
    private readonly careRecordConditionModel: Model<CareRecordConditionEntity>,
  ) {
    super(careRecordConditionModel, [
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
