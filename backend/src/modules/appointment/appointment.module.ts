import { Module } from '@nestjs/common';
import { AppointmentRepositoryModule } from './repository/appointment.repository.module';
import { AppointmentService } from './services/appointment.service';
import { AppointmentUtil } from './utils/appointment.util';
import { VehicleModelModule } from '@/modules/vehicle-model/vehicle-model.module';
import { UserVehicleModule } from '@/modules/user-vehicle/user-vehicle';
import { VehicleServiceModule } from '@/modules/vehicle-service/vehicle-service.module';

@Module({
  imports: [
    AppointmentRepositoryModule,
    VehicleModelModule,
    UserVehicleModule,
    VehicleServiceModule,
  ],
  controllers: [],
  providers: [AppointmentService, AppointmentUtil],
  exports: [AppointmentService, AppointmentUtil],
})
export class AppointmentModule {}
