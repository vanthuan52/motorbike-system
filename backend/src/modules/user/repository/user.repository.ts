import { Model, PipelineStage, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { UserDoc, UserEntity } from '../entities/user.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { RoleEntity, RoleTableName } from '@/modules/role/entities/role.entity';
import {
  IDatabaseAggregateOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { IUserDoc } from '../interfaces/user.interface';
import { EnumUserStatus } from '../enums/user.enum';

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

  async findOneWithRoleById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc | null> {
    return this.findOne<IUserDoc>({ _id }, options);
  }

  async findOneWithRole(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc | null> {
    return this.findOne<IUserDoc>(find, options);
  }

  /**
   * Find one active user by ID with role populated
   */
  async findOneActiveById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc | null> {
    return this.findOne<IUserDoc>(
      { _id, status: EnumUserStatus.active },
      {
        ...options,
        join: this._joinActive,
      },
    );
  }

  /**
   * Find all active users with role populated
   */
  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserDoc[]> {
    return this.findAll<IUserDoc>(
      { ...find, status: EnumUserStatus.active },
      {
        ...options,
        join: this._joinActive,
      },
    );
  }

  /**
   * Get total count of active users
   */
  async getTotalActive(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.getTotal(
      { ...find, status: EnumUserStatus.active },
      {
        ...options,
        join: this._joinActive,
      },
    );
  }

  /**
   * Increment password attempt counter by 1
   */
  async incrementPasswordAttempt(
    userId: string,
    options?: IDatabaseUpdateOptions,
  ): Promise<UserDoc | null> {
    return this.updateRaw(
      { _id: userId },
      { $inc: { passwordAttempt: 1 } },
      options,
    );
  }

  /**
   * Reset password attempt counter to 0
   */
  async resetPasswordAttempt(
    userId: string,
    options?: IDatabaseUpdateOptions,
  ): Promise<UserDoc | null> {
    return this.updateRaw(
      { _id: userId },
      { $set: { passwordAttempt: 0 } },
      options,
    );
  }
}
