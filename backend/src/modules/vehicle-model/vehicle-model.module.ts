import { Module } from '@nestjs/common';
import { VehicleModelRepositoryModule } from './repository/vehicle-model.repository.module';
import { VehicleModelService } from './services/vehicle-model.service';

@Module({
  imports: [VehicleModelRepositoryModule],
  controllers: [],
  providers: [VehicleModelService],
  exports: [VehicleModelRepositoryModule, VehicleModelService],
})
export class VehicleModelModule {}
