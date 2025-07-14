import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  CareRecordItemDoc,
  CareRecordItemEntity,
} from '../entities/care-record-item.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';
import { PartEntity } from '@/modules/part/entities/part.entity';

export class CareRecordItemRepository extends DatabaseRepositoryBase<
  CareRecordItemEntity,
  CareRecordItemDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'careRecord',
      localField: 'careRecord',
      foreignField: '_id',
      model: CareRecordEntity.name,
      justOne: true,
    },
    {
      path: 'part',
      localField: 'part',
      foreignField: '_id',
      model: PartEntity.name,
      justOne: true,
    },
  ];

  constructor(
    @InjectDatabaseModel(CareRecordItemEntity.name)
    private readonly careRecordItemModel: Model<CareRecordItemEntity>,
  ) {
    super(careRecordItemModel, [
      {
        path: 'careRecord',
        localField: 'careRecord',
        foreignField: '_id',
        model: CareRecordEntity.name,
        justOne: true,
      },
      {
        path: 'part',
        localField: 'part',
        foreignField: '_id',
        model: PartEntity.name,
        justOne: true,
      },
    ]);
  }
}
