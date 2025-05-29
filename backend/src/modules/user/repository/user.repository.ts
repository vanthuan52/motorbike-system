import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { UserDoc, UserEntity } from '../entities/user.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class UserRepository extends DatabaseRepositoryBase<
  UserEntity,
  UserDoc
> {
  readonly _joinActive: PopulateOptions[] = [];

  constructor(
    @InjectDatabaseModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {
    super(userModel);
  }
}
