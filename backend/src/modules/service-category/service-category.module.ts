import { Module } from '@nestjs/common';
import { ServiceCategoryRepositoryModule } from './repository/service-category.repository.module';
import { ServiceCategoryService } from './services/service-category.services';
import { ServiceCategoryUtil } from './utils/service-category.util';

@Module({
  imports: [ServiceCategoryRepositoryModule],
  controllers: [],
  providers: [ServiceCategoryService, ServiceCategoryUtil],
  exports: [
    ServiceCategoryRepositoryModule,
    ServiceCategoryService,
    ServiceCategoryUtil,
  ],
})
export class ServiceCategoryModule {}
