import { Module } from '@nestjs/common';
import { ServicePriceService } from './services/service-price.services';
import { ServicePriceUtil } from './utils/service-price.util';

import { ServicePriceRepository } from './repository/service-price.repository';
import { VehicleModelModule } from '@/modules/vehicle-model/vehicle-model.module';
import { VehicleServiceModule } from '@/modules/vehicle-service/vehicle-service.module';

@Module({
  imports: [VehicleModelModule, VehicleServiceModule],
  controllers: [],
  providers: [ServicePriceService, ServicePriceUtil, ServicePriceRepository],
  exports: [ServicePriceService, ServicePriceUtil, ServicePriceRepository],
})
export class ServicePriceModule {}
