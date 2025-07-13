import { Module } from '@nestjs/common';
import { UserVehicleRepositoryModule } from './repository/user-vehicle.repository.module';
import { UserVehicleService } from './services/user-vehicle.service';

@Module({
  imports: [UserVehicleRepositoryModule],
  controllers: [],
  providers: [UserVehicleService],
  exports: [UserVehicleRepositoryModule, UserVehicleService],
})
export class UserVehicleModule {}
