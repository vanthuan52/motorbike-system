import { Module } from '@nestjs/common';
import { HiringRepositoryModule } from './repository/hiring.repository.module';
import { HiringService } from './services/hiring.services';
import { CandidateRepositoryModule } from './repository/candidate.respostory.module';
import { CandidateService } from './services/candidate.services';

@Module({
  imports: [HiringRepositoryModule, CandidateRepositoryModule],
  controllers: [],
  providers: [HiringService, CandidateService],
  exports: [
    HiringRepositoryModule,
    HiringService,
    CandidateService,
    CandidateRepositoryModule,
  ],
})
export class HiringModule {}
