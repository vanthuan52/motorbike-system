import { Module } from '@nestjs/common';
import { VehicleServiceRepositoryModule } from './repository/vehicle-service.repository.module';
import { VehicleServiceService } from './services/vehicle-service.service';
import { VehicleServiceUtil } from './utils/vehicle-service.util';

@Module({
  imports: [VehicleServiceRepositoryModule],
  controllers: [],
  providers: [VehicleServiceService, VehicleServiceUtil],
  exports: [
    VehicleServiceRepositoryModule,
    VehicleServiceService,
    VehicleServiceUtil,
  ],
})
export class VehicleServiceModule {}
