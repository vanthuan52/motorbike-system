import { Module } from '@nestjs/common';
import { ServiceCategoryRepositoryModule } from './repository/service-category.repository.module';
import { ServiceCategoryService } from './services/service-category.services';

@Module({
  imports: [ServiceCategoryRepositoryModule],
  controllers: [],
  providers: [ServiceCategoryService],
  exports: [ServiceCategoryRepositoryModule, ServiceCategoryService],
})
export class ServiceCategoryModule {}
