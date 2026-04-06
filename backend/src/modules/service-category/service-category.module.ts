import { Module } from '@nestjs/common';
import { ServiceCategoryService } from './services/service-category.services';
import { ServiceCategoryRepository } from './repository/service-category.repository';
import { ServiceCategoryUtil } from './utils/service-category.util';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ServiceCategoryService,
    ServiceCategoryRepository,
    ServiceCategoryUtil,
  ],
  exports: [
    ServiceCategoryService,
    ServiceCategoryRepository,
    ServiceCategoryUtil,
  ],
})
export class ServiceCategoryModule {}
