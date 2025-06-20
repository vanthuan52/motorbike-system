import { Model, PopulateOptions } from 'mongoose';

import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { CandidateDoc, CandidateEntity } from '../entities/candidate.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class CandidateRepository extends DatabaseRepositoryBase<
  CandidateEntity,
  CandidateDoc
> {
  readonly _joinActive: PopulateOptions[] = [];
  constructor(
    @InjectDatabaseModel(CandidateEntity.name)
    private readonly candidateModel: Model<CandidateEntity>,
  ) {
    super(candidateModel);
  }
}
