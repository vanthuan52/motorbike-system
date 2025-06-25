import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidateReviewRepository } from './candidate-review.repository';
import {
  CandidateReviewEntity,
  CandidateReviewSchema,
} from '../entities/candidate-review.entity';

@Module({
  providers: [CandidateReviewRepository],
  exports: [CandidateReviewRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: CandidateReviewEntity.name, schema: CandidateReviewSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CandidateReviewRepositoryModule {}
