import { Module } from '@nestjs/common';
import { HelloPublicController } from '@/modules/hello/controllers/hello.public.controller';
import { AuthPublicController } from '@/modules/auth/controllers/auth.public.controller';
import { UserModule } from '@/modules/user/user.module';
import { RoleModule } from '@/modules/role/role.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionModule } from '@/modules/session/session.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
@Module({
  controllers: [HelloPublicController, AuthPublicController],
  providers: [],
  exports: [],
  imports: [UserModule, RoleModule, AuthModule, SessionModule, ApiKeyModule],
})
export class RoutesPublicModule {}
