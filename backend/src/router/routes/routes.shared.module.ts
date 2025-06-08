import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionSharedController } from '@/modules/session/controllers/session.shared.controller';
import { SessionModule } from '@/modules/session/session.module';
import { UserModule } from '@/modules/user/user.module';
import { UserSharedController } from '@/modules/user/controllers/user.shared.controller';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { AuthSharedController } from '@/modules/auth/controllers/auth.shared.controller';

@Module({
  controllers: [
    SessionSharedController,
    UserSharedController,
    AuthSharedController,
  ],
  providers: [],
  exports: [],
  imports: [UserModule, AuthModule, SessionModule, ApiKeyModule],
})
export class RoutesSharedModule {}
