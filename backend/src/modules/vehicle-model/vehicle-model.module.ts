import { Module } from '@nestjs/common';
import { VehicleModelRepository } from './repository/vehicle-model.repository';
import { VehicleModelService } from './services/vehicle-model.service';
import { VehicleModelUtil } from './utils/vehicle-model.util';
import { VehicleBrandModule } from '@/modules/vehicle-brand/vehicle-brand.module';

@Module({
  imports: [VehicleBrandModule],
  controllers: [],
  providers: [VehicleModelRepository, VehicleModelService, VehicleModelUtil],
  exports: [VehicleModelRepository, VehicleModelService, VehicleModelUtil],
})
export class VehicleModelModule {}
