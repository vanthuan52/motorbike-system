import { Module } from '@nestjs/common';
import { ServicePriceRepositoryModule } from './respository/service-price.repository.module';
import { ServicePriceService } from './services/service-price.services';

@Module({
  imports: [ServicePriceRepositoryModule],
  controllers: [],
  providers: [ServicePriceService],
  exports: [ServicePriceRepositoryModule, ServicePriceService],
})
export class ServicePriceModule {}
