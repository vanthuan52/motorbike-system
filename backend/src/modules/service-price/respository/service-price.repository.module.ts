import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { ServicePriceRepository } from './service-price.repository';
import {
  ServicePriceEntity,
  ServicePriceSchema,
} from '../entities/service-price.entity';

ServicePriceSchema.index(
  {
    vehicleService: 1,
    vehicleModel: 1,
    dateStart: 1,
    dateEnd: 1,
  },
  {
    name: 'idx_service_price_date_range',
  },
);

ServicePriceSchema.index({ vehicleService: 1 });
ServicePriceSchema.index({ vehicleModel: 1 });
ServicePriceSchema.index({ dateStart: 1 });
ServicePriceSchema.index({ dateEnd: 1 });

@Module({
  providers: [ServicePriceRepository],
  exports: [ServicePriceRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: ServicePriceEntity.name, schema: ServicePriceSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class ServicePriceRepositoryModule {}
