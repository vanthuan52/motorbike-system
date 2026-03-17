import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { RoleDoc, RoleEntity } from '../entities/role.entity';
import {
  DatabaseHelperQueryContain,
  InjectDatabaseModel,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseExistsOptions } from '@/common/database/interfaces/database.interface';

@Injectable()
export class RoleRepository extends DatabaseRepositoryBase<
  RoleEntity,
  RoleDoc
> {
  constructor(
    @InjectDatabaseModel(RoleEntity.name)
    private readonly roleModel: Model<RoleEntity>,
  ) {
    super(roleModel);
  }

  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    return this.exists(
      DatabaseHelperQueryContain('name', name, { fullWord: true }),
      options,
    );
  }
}
