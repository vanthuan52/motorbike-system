import { Module } from '@nestjs/common';
import { ServicePriceService } from './services/service-price.services';
import { ServicePriceUtil } from './utils/service-price.util';

@Module({
  imports: [],
  controllers: [],
  providers: [ServicePriceService, ServicePriceUtil],
  exports: [ServicePriceService, ServicePriceUtil],
})
export class ServicePriceModule {}
