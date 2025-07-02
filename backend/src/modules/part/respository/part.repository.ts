import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { PartDoc, PartEntity } from '../entities/part.entity';

export class PartRepository extends DatabaseRepositoryBase<
  PartEntity,
  PartDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'type',
      localField: 'type',
      foreignField: '_id',
      model: PartEntity.name,
      justOne: true,
      match: {
        isActive: true,
      },
    },
  ];

  constructor(
    @InjectDatabaseModel(PartEntity.name)
    private readonly partModel: Model<PartEntity>,
  ) {
    super(partModel, [
      {
        path: 'type',
        localField: 'type',
        foreignField: '_id',
        model: PartEntity.name,
        justOne: true,
      },
    ]);
  }

  async findOneBySlug(slug: string): Promise<PartDoc | null> {
    return this.partModel.findOne({ slug }).exec();
  }
}
