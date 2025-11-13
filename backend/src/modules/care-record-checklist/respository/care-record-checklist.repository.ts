import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  CareRecordChecklistDoc,
  CareRecordChecklistEntity,
} from '../entities/care-record-checklist.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';
import { ServiceChecklistEntity } from '@/modules/service-checklist/entities/service-checklist.entity';
import { CareRecordServiceEntity } from '@/modules/care-record-service/entities/care-record-service.entity';
import { PartEntity } from '@/modules/part/entities/part.entity';

export class CareRecordChecklistRepository extends DatabaseRepositoryBase<
  CareRecordChecklistEntity,
  CareRecordChecklistDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    // {
    //   path: 'careRecordService',
    //   localField: 'careRecordService',
    //   foreignField: '_id',
    //   model: CareRecordServiceEntity.name,
    //   justOne: true,
    // },
    {
      path: 'serviceChecklist',
      localField: 'serviceChecklist',
      foreignField: '_id',
      model: ServiceChecklistEntity.name,
      justOne: true,
    },
    {
      path: 'parts',
      localField: 'parts',
      foreignField: '_id',
      model: PartEntity.name,
    },
  ];

  constructor(
    @InjectDatabaseModel(CareRecordChecklistEntity.name)
    private readonly careRecordChecklistModel: Model<CareRecordChecklistEntity>,
  ) {
    super(careRecordChecklistModel, [
      // {
      //   path: 'careRecordService',
      //   localField: 'careRecordService',
      //   foreignField: '_id',
      //   model: CareRecordServiceEntity.name,
      //   justOne: true,
      // },
      {
        path: 'serviceChecklist',
        localField: 'serviceChecklist',
        foreignField: '_id',
        model: ServiceChecklistEntity.name,
        justOne: true,
      },
      {
        path: 'parts',
        localField: 'parts',
        foreignField: '_id',
        model: PartEntity.name,
      },
    ]);
  }
}
