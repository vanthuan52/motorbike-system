import { Module } from '@nestjs/common';
import { SessionRepositoryModule } from './repository/session.repository.module';
import { SessionService } from './services/session.service';

@Module({
  imports: [SessionRepositoryModule],
  exports: [SessionService],
  providers: [SessionService],
  controllers: [],
})
export class SessionModule {}
