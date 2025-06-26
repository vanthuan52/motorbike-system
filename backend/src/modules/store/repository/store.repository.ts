import { PopulateOption, Model } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { StoreDoc, StoreEntity } from '../entities/store.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class StoreRepository extends DatabaseRepositoryBase<
  StoreEntity,
  StoreDoc
> {
  readonly _joinActive: PopulateOption[] = [];
  constructor(
    @InjectDatabaseModel(StoreEntity.name)
    private readonly storeModel: Model<StoreEntity>,
  ) {
    super(storeModel);
  }
  async findOneBySlug(slug: string): Promise<StoreDoc | null> {
    return this.storeModel.findOne({ slug }).exec();
  }
}
