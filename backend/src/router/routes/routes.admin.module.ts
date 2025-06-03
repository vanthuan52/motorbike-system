import { Module } from '@nestjs/common';
import { RoleAdminController } from '@/modules/role/controllers/role.admin.controller';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  controllers: [RoleAdminController],
  providers: [],
  exports: [],
  imports: [RoleModule, UserModule],
})
export class RoutesAdminModule {}
