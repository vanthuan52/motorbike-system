import { Module } from '@nestjs/common';
import { AppointmentService } from './services/appointment.service';
import { AppointmentUtil } from './utils/appointment.util';
import { VehicleModelModule } from '@/modules/vehicle-model/vehicle-model.module';
import { UserVehicleModule } from '@/modules/user-vehicle/user-vehicle.module';
import { VehicleServiceModule } from '@/modules/vehicle-service/vehicle-service.module';
import { AppointmentRepository } from './repository/appointment.repository';

@Module({
  imports: [VehicleModelModule, UserVehicleModule, VehicleServiceModule],
  controllers: [],
  providers: [AppointmentService, AppointmentUtil, AppointmentRepository],
  exports: [AppointmentService, AppointmentUtil, AppointmentRepository],
})
export class AppointmentModule {}
