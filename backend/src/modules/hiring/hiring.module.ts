import { Module } from '@nestjs/common';
import { HiringRepositoryModule } from './repository/hiring.repository.module';
import { HiringService } from './services/hiring.services';
import { CandidateRepositoryModule } from './repository/candidate.respostory.module';
import { CandidateService } from './services/candidate.services';
import { CandidateReviewRepositoryModule } from './repository/candidate-review.respository.module';
import { CandidateReviewService } from './services/candidate-review.services';

@Module({
  imports: [
    HiringRepositoryModule,
    CandidateRepositoryModule,
    CandidateReviewRepositoryModule,
  ],
  controllers: [],
  providers: [HiringService, CandidateService, CandidateReviewService],
  exports: [
    HiringRepositoryModule,
    HiringService,
    CandidateService,
    CandidateRepositoryModule,
    CandidateReviewService,
    CandidateReviewRepositoryModule,
  ],
})
export class HiringModule {}
