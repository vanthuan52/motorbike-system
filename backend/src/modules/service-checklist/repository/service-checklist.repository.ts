import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  ServiceChecklistDoc,
  ServiceChecklistEntity,
} from '../entities/service-checklist.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class ServiceChecklistRepository extends DatabaseRepositoryBase<
  ServiceChecklistEntity,
  ServiceChecklistDoc
> {
  readonly _joinActive: PopulateOptions[] = [];

  constructor(
    @InjectDatabaseModel(ServiceChecklistEntity.name)
    private readonly serviceChecklistModel: Model<ServiceChecklistEntity>,
  ) {
    super(serviceChecklistModel);
  }
}
