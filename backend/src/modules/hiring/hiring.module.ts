import { Module } from '@nestjs/common';
import { HiringService } from './services/hiring.service';
import { CandidateService } from './services/candidate.service';
import { CandidateReviewService } from './services/candidate-review.service';
import { CandidateUtil } from './utils/candidate.util';
import { CandidateReviewUtil } from './utils/candidate-review.util';
import { HiringUtil } from './utils/hiring.util';
import { HiringRepository } from './repository/hiring.repository';
import { CandidateRepository } from './repository/candidate.repository';
import { CandidateReviewRepository } from './repository/candidate-review.repository';
import { HiringAdminController } from './controllers/hiring.admin.controller';
import { HiringPublicController } from './controllers/hiring.public.controller';
import { CandidateAdminController } from './controllers/candidate.admin.controller';
import { CandidatePublicController } from './controllers/candidate.public.controller';
import { CandidateReviewAdminController } from './controllers/candidate-review.admin.controller';

@Module({
  imports: [],
  controllers: [
    HiringAdminController,
    HiringPublicController,
    CandidateAdminController,
    CandidatePublicController,
    CandidateReviewAdminController,
  ],
  providers: [
    HiringService,
    CandidateService,
    CandidateReviewService,
    HiringRepository,
    CandidateRepository,
    CandidateReviewRepository,
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
