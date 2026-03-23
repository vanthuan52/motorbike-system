import { Module } from '@nestjs/common';
import { HiringService } from './services/hiring.service';
import { CandidateService } from './services/candidate.service';
import { CandidateReviewService } from './services/candidate-review.service';
import { CandidateUtil } from './utils/candidate.util';
import { CandidateReviewUtil } from './utils/candidate-review.util';
import { HiringUtil } from './utils/hiring.util';

@Module({
  imports: [],
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
    HiringService,
    CandidateService,
    CandidateReviewService,
    CandidateUtil,
    CandidateReviewUtil,
    HiringUtil,
  ],
})
export class HiringModule {}
