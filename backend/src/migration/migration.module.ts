import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { MigrationUserSeed } from './seeds/migration.user.seed';
import { MigrationRoleSeed } from './seeds/migration.role.seed';
import { AuthModule } from '@/modules/auth/auth.module';
import { CommonModule } from '@/common/common.module';

// TODO: Change With Commander
@Module({
  imports: [CommonModule, CommandModule, AuthModule, RoleModule, UserModule],
  providers: [MigrationRoleSeed, MigrationUserSeed],
  exports: [],
})
export class MigrationModule {}
