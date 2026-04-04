import { Module } from '@nestjs/common';
import { JobService } from './services/job.service';
import { JobApplicationService } from './services/job-application.service';
import { ApplicationReviewService } from './services/application-review.service';
import { JobApplicationUtil } from './utils/job-application.util';
import { ApplicationReviewUtil } from './utils/application-review.util';
import { JobUtil } from './utils/job.util';
import { JobRepository } from './repository/job.repository';
import { JobApplicationRepository } from './repository/job-application.repository';
import { ApplicationReviewRepository } from './repository/application-review.repository';
import { JobAdminController } from './controllers/job.admin.controller';
import { JobPublicController } from './controllers/job.public.controller';
import { JobApplicationAdminController } from './controllers/job-application.admin.controller';
import { JobApplicationPublicController } from './controllers/job-application.public.controller';
import { ApplicationReviewAdminController } from './controllers/application-review.admin.controller';

@Module({
  imports: [],
  controllers: [
    JobAdminController,
    JobPublicController,
    JobApplicationAdminController,
    JobApplicationPublicController,
    ApplicationReviewAdminController,
  ],
  providers: [
    JobService,
    JobApplicationService,
    ApplicationReviewService,
    JobRepository,
    JobApplicationRepository,
    ApplicationReviewRepository,
    JobApplicationUtil,
    ApplicationReviewUtil,
    JobUtil,
  ],
  exports: [
    JobService,
    JobApplicationService,
    ApplicationReviewService,
    JobApplicationUtil,
    ApplicationReviewUtil,
    JobUtil,
  ],
})
export class JobModule {}
