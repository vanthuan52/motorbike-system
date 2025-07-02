import { Module } from '@nestjs/common';
import { VehicleBrandRepositoryModule } from './repository/vehicle-brand.repository.module';
import { VehicleBrandService } from './services/vehicle-brand.service';

@Module({
  imports: [VehicleBrandRepositoryModule],
  controllers: [],
  providers: [VehicleBrandService],
  exports: [VehicleBrandRepositoryModule, VehicleBrandService],
})
export class VehicleBrandModule {}
