import { Module } from '@nestjs/common';
import { UserAdminController } from '@/modules/user/controllers/user.admin.controller';
import { UserModule } from '@/modules/user/user.module';
import { RoleModule } from '@/modules/role/role.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  controllers: [UserAdminController],
  providers: [],
  exports: [],
  imports: [RoleModule, UserModule, AuthModule],
})
export class RoutesAmdinModule {}
