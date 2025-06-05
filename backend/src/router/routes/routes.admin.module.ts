import { Module } from '@nestjs/common';
import { RoleAdminController } from '@/modules/role/controllers/role.admin.controller';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { UserAdminController } from '@/modules/user/controllers/user.admin.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionModule } from '@/modules/session/session.module';

@Module({
  controllers: [RoleAdminController, UserAdminController],
  providers: [],
  exports: [],
  imports: [RoleModule, UserModule, AuthModule, SessionModule],
})
export class RoutesAdminModule {}
