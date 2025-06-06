import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyEntity, ApiKeySchema } from '../entities/api-key.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { ApiKeyRepository } from './api-key.repository';

@Module({
  providers: [ApiKeyRepository],
  exports: [ApiKeyRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ApiKeyEntity.name,
          schema: ApiKeySchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class ApiKeyRepositoryModule {}
