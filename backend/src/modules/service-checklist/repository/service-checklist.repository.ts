import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  ServiceChecklistDoc,
  ServiceChecklistEntity,
} from '../entities/service-checklist.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { CareAreaEntity } from '@/modules/care-area/entities/care-area.entity';

export class ServiceChecklistRepository extends DatabaseRepositoryBase<
  ServiceChecklistEntity,
  ServiceChecklistDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'careArea',
      localField: 'careArea',
      foreignField: '_id',
      model: CareAreaEntity.name,
      justOne: true,
    },
  ];
  constructor(
    @InjectDatabaseModel(ServiceChecklistEntity.name)
    private readonly serviceChecklistModel: Model<ServiceChecklistEntity>,
  ) {
    super(serviceChecklistModel, [
      {
        path: 'careArea',
        localField: 'careArea',
        foreignField: '_id',
        model: CareAreaEntity.name,
        justOne: true,
      },
    ]);
  }
}
