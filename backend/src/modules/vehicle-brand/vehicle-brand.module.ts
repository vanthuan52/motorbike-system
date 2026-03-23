import { Module } from '@nestjs/common';
import { VehicleBrandRepository } from './repository/vehicle-brand.repository';
import { VehicleBrandService } from './services/vehicle-brand.service';
import { VehicleBrandUtil } from './utils/vehicle-brand.util';

@Module({
  imports: [],
  controllers: [],
  providers: [VehicleBrandRepository, VehicleBrandService, VehicleBrandUtil],
  exports: [VehicleBrandRepository, VehicleBrandService, VehicleBrandUtil],
})
export class VehicleBrandModule {}
