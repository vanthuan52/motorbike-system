import { Module } from '@nestjs/common';
import { RoleAdminController } from '@/modules/role/controllers/role.admin.controller';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { UserAdminController } from '@/modules/user/controllers/user.admin.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionModule } from '@/modules/session/session.module';
import { ApiKeyAdminController } from '@/modules/api-key/controllers/api-key.admin.controller';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';

@Module({
  controllers: [
    RoleAdminController,
    UserAdminController,
    ApiKeyAdminController,
  ],
  providers: [],
  exports: [],
  imports: [RoleModule, UserModule, AuthModule, SessionModule, ApiKeyModule],
})
export class RoutesAdminModule {}
