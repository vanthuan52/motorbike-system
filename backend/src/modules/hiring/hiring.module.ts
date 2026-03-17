import { Module } from '@nestjs/common';
import { HiringRepositoryModule } from './repository/hiring.repository.module';
import { HiringService } from './services/hiring.service';
import { CandidateRepositoryModule } from './repository/candidate.respostory.module';
import { CandidateService } from './services/candidate.service';
import { CandidateReviewRepositoryModule } from './repository/candidate-review.respository.module';
import { CandidateReviewService } from './services/candidate-review.service';
import { CandidateUtil } from './utils/candidate.util';
import { CandidateReviewUtil } from './utils/candidate-review.util';
import { HiringUtil } from './utils/hiring.util';

@Module({
  imports: [
    HiringRepositoryModule,
    CandidateRepositoryModule,
    CandidateReviewRepositoryModule,
  ],
  controllers: [],
  providers: [
    HiringService,
    CandidateService,
    CandidateReviewService,
    CandidateUtil,
    CandidateReviewUtil,
    HiringUtil,
  ],
  exports: [
    HiringRepositoryModule,
    HiringService,
    CandidateService,
    CandidateRepositoryModule,
    CandidateReviewService,
    CandidateReviewRepositoryModule,
    CandidateUtil,
    CandidateReviewUtil,
    HiringUtil,
  ],
})
export class HiringModule {}
