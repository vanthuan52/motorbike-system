import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { MigrationUserSeed } from './seeds/migration.user.seed';
import { MigrationRoleSeed } from './seeds/migration.role.seed';
import { AuthModule } from '@/modules/auth/auth.module';
import { CommonModule } from '@/common/common.module';
import { MigrationPartTypeSeed } from './seeds/migration.part-type.seed';
import { PartTypeModule } from '@/modules/part-type/part-type.module';
import { HiringModule } from '@/modules/hiring/hiring.module';
import { StoreModule } from '@/modules/store/store.module';
import { MigrationHiringSeed } from './seeds/migration.hiring.seed';
import { MigrationStoreSeed } from './seeds/migration.store.seed';

// TODO: Change With Commander
@Module({
  imports: [
    CommonModule,
    CommandModule,
    AuthModule,
    RoleModule,
    UserModule,
    PartTypeModule,
    HiringModule,
    StoreModule,
  ],
  providers: [
    MigrationRoleSeed,
    MigrationUserSeed,
    MigrationPartTypeSeed,
    MigrationHiringSeed,
    MigrationStoreSeed,
  ],
  exports: [],
})
export class MigrationModule {}
