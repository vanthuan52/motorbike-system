import { Module } from '@nestjs/common';
import { RoleSystemController } from '@/modules/role/controllers/role.system.controller';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { UserSystemController } from '@/modules/user/controllers/user.system.controller';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';

@Module({
  controllers: [RoleSystemController, UserSystemController],
  providers: [],
  exports: [],
  imports: [UserModule, RoleModule, ApiKeyModule],
})
export class RoutesSystemModule {}
