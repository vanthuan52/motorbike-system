import { Module } from '@nestjs/common';
import { RoleAdminController } from '@/modules/role/controllers/role.admin.controller';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { UserAdminController } from '@/modules/user/controllers/user.admin.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionModule } from '@/modules/session/session.module';
import { ApiKeyAdminController } from '@/modules/api-key/controllers/api-key.admin.controller';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { SessionAdminController } from '@/modules/session/controllers/session.admin.controller';
import { AuthAdminController } from '@/modules/auth/controllers/auth.admin.controller';
import { PartTypeModule } from '@/modules/part-type/part-type.module';
import { PartTypeAdminController } from '@/modules/part-type/controllers/part-type.admin.controller';

@Module({
  controllers: [
    RoleAdminController,
    UserAdminController,
    AuthAdminController,
    ApiKeyAdminController,
    SessionAdminController,
    PartTypeAdminController,
  ],
  providers: [],
  exports: [],
  imports: [
    RoleModule,
    UserModule,
    AuthModule,
    SessionModule,
    ApiKeyModule,
    SessionModule,
    PartTypeModule,
  ],
})
export class RoutesAdminModule {}
