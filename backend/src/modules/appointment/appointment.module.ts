import { Module } from '@nestjs/common';

import { AppointmentsRepositoryModule } from './repository/appointment.repository.module';
import { AppointmentsService } from './services/appointment.service';

@Module({
  imports: [AppointmentsRepositoryModule],
  controllers: [],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
