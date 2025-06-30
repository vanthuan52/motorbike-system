import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  ServiceCategoryDoc,
  ServiceCategoryEntity,
} from '../entities/service-category.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class ServiceCategoryRepository extends DatabaseRepositoryBase<
  ServiceCategoryEntity,
  ServiceCategoryDoc
> {
  readonly _joinActive: PopulateOptions[] = [];

  constructor(
    @InjectDatabaseModel(ServiceCategoryEntity.name)
    private readonly ServiceCategoryModel: Model<ServiceCategoryEntity>,
  ) {
    super(ServiceCategoryModel);
  }

  async findOneBySlug(slug: string): Promise<ServiceCategoryDoc | null> {
    return this.ServiceCategoryModel.findOne({ slug }).exec();
  }
}
