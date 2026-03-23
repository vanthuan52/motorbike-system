import { Module } from '@nestjs/common';
import { ServiceCategoryRepository } from './service-category.repository';

@Module({
  providers: [ServiceCategoryRepository],
  exports: [ServiceCategoryRepository],
})
export class ServiceCategoryRepositoryModule {}
