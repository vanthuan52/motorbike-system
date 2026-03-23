import { Module } from '@nestjs/common';
import { ServiceCategoryService } from './services/service-category.services';
import { ServiceCategoryUtil } from './utils/service-category.util';

@Module({
  imports: [],
  controllers: [],
  providers: [ServiceCategoryService, ServiceCategoryUtil],
  exports: [ServiceCategoryService, ServiceCategoryUtil],
})
export class ServiceCategoryModule {}
