import { Module } from '@nestjs/common';
import { ServicePriceRepositoryModule } from './respository/service-price.repository.module';
import { ServicePriceService } from './services/service-price.services';
import { ServicePriceUtil } from './utils/service-price.util';
import { VehicleModelRepositoryModule } from '@/modules/vehicle-model/repository/vehicle-model.repository.module';
import { VehicleServiceRepositoryModule } from '@/modules/vehicle-service/repository/vehicle-service.repository.module';

@Module({
  imports: [
    ServicePriceRepositoryModule,
    VehicleModelRepositoryModule,
    VehicleServiceRepositoryModule,
  ],
  controllers: [],
  providers: [ServicePriceService, ServicePriceUtil],
  exports: [
    ServicePriceRepositoryModule,
    ServicePriceService,
    ServicePriceUtil,
  ],
})
export class ServicePriceModule {}
