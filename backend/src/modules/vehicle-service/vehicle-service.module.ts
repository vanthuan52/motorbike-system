import { Module } from '@nestjs/common';
import { VehicleServiceRepository } from './repository/vehicle-service.repository';
import { VehicleServiceService } from './services/vehicle-service.service';
import { VehicleServiceUtil } from './utils/vehicle-service.util';

@Module({
  imports: [],
  controllers: [],
  providers: [VehicleServiceRepository, VehicleServiceService, VehicleServiceUtil],
  exports: [VehicleServiceRepository, VehicleServiceService, VehicleServiceUtil],
})
export class VehicleServiceModule {}
