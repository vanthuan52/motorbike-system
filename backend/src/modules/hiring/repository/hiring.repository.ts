import { Model, PopulateOptions } from 'mongoose';

import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { HiringDoc, HiringEntity } from '../entities/hiring.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class HiringRepository extends DatabaseRepositoryBase<
  HiringEntity,
  HiringDoc
> {
  readonly _joinActive: PopulateOptions[] = [];
  constructor(
    @InjectDatabaseModel(HiringEntity.name)
    private readonly hiringModel: Model<HiringEntity>,
  ) {
    super(hiringModel);
  }
  async findOneBySlug(slug: string): Promise<HiringDoc | null> {
    return this.hiringModel.findOne({ slug }).exec();
  }
}
