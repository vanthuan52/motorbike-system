import { Module } from '@nestjs/common';
import { VehicleBrandRepositoryModule } from './repository/vehicle-brand.repository.module';
import { VehicleBrandService } from './services/vehicle-brand.service';
import { VehicleBrandUtil } from './utils/vehicle-brand.util';

@Module({
  imports: [VehicleBrandRepositoryModule],
  controllers: [],
  providers: [VehicleBrandService, VehicleBrandUtil],
  exports: [
    VehicleBrandRepositoryModule,
    VehicleBrandService,
    VehicleBrandUtil,
  ],
})
export class VehicleBrandModule {}
