import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ApiKeyDoc, ApiKeyEntity } from '../entities/api-key.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';

@Injectable()
export class ApiKeyRepository extends DatabaseRepositoryBase<
  ApiKeyEntity,
  ApiKeyDoc
> {
  constructor(
    @InjectDatabaseModel(ApiKeyEntity.name)
    private readonly ApiKeyDoc: Model<ApiKeyEntity>,
  ) {
    super(ApiKeyDoc);
  }
}
