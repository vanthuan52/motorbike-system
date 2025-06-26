import { Module } from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreEntity, StoreSchema } from '../entities/store.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [StoreRepository],
  exports: [StoreRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: StoreEntity.name, schema: StoreSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class StoreRepositoryModule {}
