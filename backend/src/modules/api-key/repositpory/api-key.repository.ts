import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ApiKeyDoc, ApiKeyEntity } from '../entities/api-key.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';

@Injectable()
export class ApiKeyRepository extends DatabaseRepositoryBase<
  ApiKeyEntity,
  ApiKeyDoc
> {
  constructor(
    @InjectDatabaseModel(ApiKeyEntity.name)
    private readonly apiKeyDoc: Model<ApiKeyEntity>,
  ) {
    super(apiKeyDoc);
  }

  async findOneByKey(
    key: string,
    options?: IDatabaseOptions,
  ): Promise<ApiKeyDoc | null> {
    return this.findOne<ApiKeyDoc>({ key }, options);
  }

  async findOneByActiveKey(
    key: string,
    options?: IDatabaseOptions,
  ): Promise<ApiKeyDoc | null> {
    return this.findOne<ApiKeyDoc>(
      {
        key,
        isActive: true,
      },
      options,
    );
  }
}
