import { Module } from '@nestjs/common';
import { ServicePriceRepositoryModule } from './respository/service-price.repository.module';
import { ServicePriceService } from './services/service-price.services';
import { VehicleModelRepositoryModule } from '../vehicle-model/repository/vehicle-model.repository.module';

@Module({
  imports: [ServicePriceRepositoryModule, VehicleModelRepositoryModule],
  controllers: [],
  providers: [ServicePriceService],
  exports: [ServicePriceRepositoryModule, ServicePriceService],
})
export class ServicePriceModule {}
