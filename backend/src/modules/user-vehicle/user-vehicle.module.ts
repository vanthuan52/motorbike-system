import { Module } from '@nestjs/common';
import { UserVehicleRepository } from './repository/user-vehicle.repository';
import { UserVehicleService } from './services/user-vehicle.service';
import { UserVehicleUtil } from './utils/user-vehicle.util';
import { UserRepositoryModule } from '@/modules/user/repository/user.repository.module';

@Module({
  imports: [UserRepositoryModule],
  controllers: [],
  providers: [UserVehicleRepository, UserVehicleService, UserVehicleUtil],
  exports: [UserVehicleRepository, UserVehicleService, UserVehicleUtil],
})
export class UserVehicleModule {}
