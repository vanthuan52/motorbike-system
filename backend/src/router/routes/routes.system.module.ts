import { Module } from '@nestjs/common';
import { RoleSystemController } from '@/modules/role/controllers/role.system.controller';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  controllers: [RoleSystemController],
  providers: [],
  exports: [],
  imports: [RoleModule, UserModule],
})
export class RoutesSystemModule {}
