import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { PartTypeDoc, PartTypeEntity } from '../entities/part-type.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class PartTypeRepository extends DatabaseRepositoryBase<
  PartTypeEntity,
  PartTypeDoc
> {
  readonly _joinActive: PopulateOptions[] = [];

  constructor(
    @InjectDatabaseModel(PartTypeEntity.name)
    private readonly partTypeModel: Model<PartTypeEntity>,
  ) {
    super(partTypeModel);
  }

  async findOneBySlug(slug: string): Promise<PartTypeDoc | null> {
    return this.partTypeModel.findOne({ slug }).exec();
  }
}
