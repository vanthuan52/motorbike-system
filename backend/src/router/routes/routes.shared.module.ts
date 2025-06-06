import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionSharedController } from '@/modules/session/controllers/session.shared.controller';
import { SessionModule } from '@/modules/session/session.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  controllers: [SessionSharedController],
  providers: [],
  exports: [],
  imports: [UserModule, AuthModule, SessionModule],
})
export class RoutesSharedModule {}
