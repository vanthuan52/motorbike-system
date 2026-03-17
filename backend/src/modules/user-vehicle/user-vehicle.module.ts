import { Module } from '@nestjs/common';
import { UserVehicleRepositoryModule } from './repository/user-vehicle.repository.module';
import { UserVehicleService } from './services/user-vehicle.service';
import { UserVehicleUtil } from './utils/user-vehicle.util';
import { VehicleModelRepositoryModule } from '@/modules/vehicle-model/repository/vehicle-model.repository.module';
import { UserRepositoryModule } from '@/modules/user/repository/user.repository.module';

@Module({
  imports: [
    UserVehicleRepositoryModule,
    VehicleModelRepositoryModule,
    UserRepositoryModule,
  ],
  controllers: [],
  providers: [UserVehicleService, UserVehicleUtil],
  exports: [UserVehicleRepositoryModule, UserVehicleService, UserVehicleUtil],
})
export class UserVehicleModule {}
