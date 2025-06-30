import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceCategoryRepository } from './service-category.repository';
import {
  ServiceCategoryEntity,
  ServiceCategorySchema,
} from '../entities/service-category.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [ServiceCategoryRepository],
  exports: [ServiceCategoryRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: ServiceCategoryEntity.name, schema: ServiceCategorySchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class ServiceCategoryRepositoryModule {}
