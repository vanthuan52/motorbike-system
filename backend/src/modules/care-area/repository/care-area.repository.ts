import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { CareAreaDoc, CareAreaEntity } from '../entities/care-area.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class CareAreaRepository extends DatabaseRepositoryBase<
  CareAreaEntity,
  CareAreaDoc
> {
  readonly _joinActive: PopulateOptions[] = [];

  constructor(
    @InjectDatabaseModel(CareAreaEntity.name)
    private readonly careAreaModel: Model<CareAreaEntity>,
  ) {
    super(careAreaModel);
  }
}
