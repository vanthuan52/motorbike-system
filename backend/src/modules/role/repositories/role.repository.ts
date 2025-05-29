import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { RoleDoc, RoleEntity } from '../entities/role.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

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
}
