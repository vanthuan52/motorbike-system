import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { UserUserController } from '@/modules/user/controllers/user.user.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { SessionModule } from '@/modules/session/session.module';

@Module({
  controllers: [UserUserController],
  providers: [],
  exports: [],
  imports: [UserModule, AuthModule, SessionModule, ApiKeyModule],
})
export class RoutesUserModule {}
