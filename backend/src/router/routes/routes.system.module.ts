import { Module } from '@nestjs/common';
import { RoleSystemController } from '@/modules/role/controllers/role.system.controller';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { UserSystemController } from '@/modules/user/controllers/user.system.controller';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { HealthModule } from '@/modules/health/health.module';
import { HealthSystemController } from '@/modules/health/controllers/health.system.controller';

@Module({
  controllers: [
    HealthSystemController,
    RoleSystemController,
    UserSystemController,
  ],
  providers: [],
  exports: [],
  imports: [HealthModule, UserModule, RoleModule, ApiKeyModule],
})
export class RoutesSystemModule {}
