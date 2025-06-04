import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SessionDoc, SessionEntity } from '../entities/session.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';

@Injectable()
export class SessionRepository extends DatabaseRepositoryBase<
  SessionEntity,
  SessionDoc
> {
  constructor(
    @InjectDatabaseModel(SessionEntity.name)
    private readonly sessionModel: Model<SessionEntity>,
  ) {
    super(sessionModel);
  }
}
