import { Module } from '@nestjs/common';
import { UserVehicleRepository } from './repository/user-vehicle.repository';
import { UserVehicleService } from './services/user-vehicle.service';
import { UserVehicleUtil } from './utils/user-vehicle.util';

import { VehicleModelModule } from '@/modules/vehicle-model/vehicle-model.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [VehicleModelModule, UserModule],
  controllers: [],
  providers: [UserVehicleRepository, UserVehicleService, UserVehicleUtil],
  exports: [UserVehicleRepository, UserVehicleService, UserVehicleUtil],
})
export class UserVehicleModule {}
