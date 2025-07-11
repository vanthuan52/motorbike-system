import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceChecklistRepository } from './service-checklist.repository';
import {
  ServiceChecklistEntity,
  ServiceChecklistSchema,
} from '../entities/service-checklist.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [ServiceChecklistRepository],
  exports: [ServiceChecklistRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: ServiceChecklistEntity.name, schema: ServiceChecklistSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class ServiceChecklistRepositoryModule {}
