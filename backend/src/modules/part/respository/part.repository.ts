import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { PartDoc, PartEntity } from '../entities/part.entity';
import { PartTypeEntity } from '@/modules/part-type/entities/part-type.entity';
import { VehicleBrandEntity } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';

export class PartRepository extends DatabaseRepositoryBase<
  PartEntity,
  PartDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'partType',
      localField: 'partType',
      foreignField: '_id',
      model: PartTypeEntity.name,
      justOne: true,
      match: {
        isActive: true,
      },
    },
    {
      path: 'vehicleBrand',
      localField: 'vehicleBrand',
      foreignField: '_id',
      model: VehicleBrandEntity.name,
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
        path: 'partType',
        localField: 'partType',
        foreignField: '_id',
        model: PartTypeEntity.name,
        justOne: true,
      },
      {
        path: 'vehicleBrand',
        localField: 'vehicleBrand',
        foreignField: '_id',
        model: VehicleBrandEntity.name,
        justOne: true,
      },
    ]);
  }

  async findOneBySlug(slug: string): Promise<PartDoc | null> {
    return this.partModel.findOne({ slug }).exec();
  }
}
