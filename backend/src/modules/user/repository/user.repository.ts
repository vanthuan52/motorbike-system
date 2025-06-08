import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { UserDoc, UserEntity } from '../entities/user.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { RoleEntity } from '@/modules/role/entities/role.entity';

export class UserRepository extends DatabaseRepositoryBase<
  UserEntity,
  UserDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'role',
      localField: 'role',
      foreignField: '_id',
      model: RoleEntity.name,
      justOne: true,
      match: {
        isActive: true,
      },
    },
  ];

  constructor(
    @InjectDatabaseModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {
    super(userModel, [
      {
        path: 'role',
        localField: 'role',
        foreignField: '_id',
        model: RoleEntity.name,
        justOne: true,
      },
    ]);
  }
}
