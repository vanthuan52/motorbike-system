import { Module } from '@nestjs/common';
import { ActivityLogModule } from '@/modules/activity-log/activity-log.module';
import { ActivityLogSharedController } from '@/modules/activity-log/controllers/activity-log.shared.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionSharedController } from '@/modules/session/controllers/session.shared.controller';
import { SessionModule } from '@/modules/session/session.module';
import { UserModule } from '@/modules/user/user.module';

/**
 * Shared routes module that provides endpoints accessible by multiple user types.
 * Contains controllers for .... that are shared between different access levels.
 */
@Module({
  controllers: [SessionSharedController, ActivityLogSharedController],
  providers: [],
  exports: [],
  imports: [AuthModule, UserModule, SessionModule, ActivityLogModule],
})
export class RoutesSharedModule {}
