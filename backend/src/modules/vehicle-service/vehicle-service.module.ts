import { Module } from '@nestjs/common';
import { VehicleServiceRepositoryModule } from './repository/vehicle-service.repository.module';
import { VehicleServiceService } from './services/vehicle-service.service';

@Module({
  imports: [VehicleServiceRepositoryModule],
  controllers: [],
  providers: [VehicleServiceService],
  exports: [VehicleServiceRepositoryModule, VehicleServiceService],
})
export class VehicleServiceModule {}
