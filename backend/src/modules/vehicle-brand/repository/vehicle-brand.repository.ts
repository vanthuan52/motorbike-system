import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  VehicleBrandDoc,
  VehicleBrandEntity,
} from '../entities/vehicle-brand.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class VehicleBrandRepository extends DatabaseRepositoryBase<
  VehicleBrandEntity,
  VehicleBrandDoc
> {
  readonly _joinActive: PopulateOptions[] = [];

  constructor(
    @InjectDatabaseModel(VehicleBrandEntity.name)
    private readonly vehicleBrandModel: Model<VehicleBrandEntity>,
  ) {
    super(vehicleBrandModel);
  }

  async findOneBySlug(slug: string): Promise<VehicleBrandDoc | null> {
    return this.vehicleBrandModel.findOne({ slug }).exec();
  }
}
