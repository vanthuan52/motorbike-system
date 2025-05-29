import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleEntity, RoleSchema } from '../entities/role.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { RoleRepository } from './role.repository';

@Module({
  providers: [RoleRepository],
  exports: [RoleRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: RoleEntity.name, schema: RoleSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class RoleRepositoryModule {}
