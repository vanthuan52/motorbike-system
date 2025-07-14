import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  CareRecordChecklistDoc,
  CareRecordChecklistEntity,
} from '../entities/care-record-checklist.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';
import { ServiceChecklistEntity } from '@/modules/service-checklist/entities/service-checklist.entity';

export class CareRecordChecklistRepository extends DatabaseRepositoryBase<
  CareRecordChecklistEntity,
  CareRecordChecklistDoc
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
      path: 'serviceChecklist',
      localField: 'serviceChecklist',
      foreignField: '_id',
      model: ServiceChecklistEntity.name,
      justOne: true,
    },
  ];

  constructor(
    @InjectDatabaseModel(CareRecordChecklistEntity.name)
    private readonly careRecordChecklistModel: Model<CareRecordChecklistEntity>,
  ) {
    super(careRecordChecklistModel, [
      {
        path: 'careRecord',
        localField: 'careRecord',
        foreignField: '_id',
        model: CareRecordEntity.name,
        justOne: true,
      },
      {
        path: 'serviceChecklist',
        localField: 'serviceChecklist',
        foreignField: '_id',
        model: ServiceChecklistEntity.name,
        justOne: true,
      },
    ]);
  }
}
