import { Module } from '@nestjs/common';

import { AppointmentRepositoryModule } from './repository/appointment.repository.module';
import { AppointmentService } from './services/appointment.service';

@Module({
  imports: [AppointmentRepositoryModule],
  controllers: [],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
