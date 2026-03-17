import { Module } from '@nestjs/common';
import { VehicleModelRepositoryModule } from './repository/vehicle-model.repository.module';
import { VehicleModelService } from './services/vehicle-model.service';
import { VehicleModelUtil } from './utils/vehicle-model.util';

@Module({
  imports: [VehicleModelRepositoryModule],
  controllers: [],
  providers: [VehicleModelService, VehicleModelUtil],
  exports: [
    VehicleModelRepositoryModule,
    VehicleModelService,
    VehicleModelUtil,
  ],
})
export class VehicleModelModule {}
