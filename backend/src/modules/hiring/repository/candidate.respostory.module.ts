import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidateEntity, CandidateSchema } from '../entities/candidate.entity';
import { CandidateRepository } from './candidate.repository';

@Module({
  providers: [CandidateRepository],
  exports: [CandidateRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: CandidateEntity.name, schema: CandidateSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CandidateRepositoryModule {}
