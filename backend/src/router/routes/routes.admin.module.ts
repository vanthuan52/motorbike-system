import { Module } from '@nestjs/common';
import { ActivityLogModule } from '@/modules/activity-log/activity-log.module';
import { SessionModule } from '@/modules/session/session.module';
import { UserModule } from '@/modules/user/user.module';
import { ApiKeyAdminController } from '@/modules/api-key/controllers/api-key.admin.controller';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { SessionAdminController } from '@/modules/session/controllers/session.admin.controller';
import { ActivityLogAdminController } from '@/modules/activity-log/controllers/activity-log.admin.controller';
import { DeviceAdminController } from '@/modules/device/controllers/device.admin.controller';
import { DeviceModule } from '@/modules/device/device.module';

/**
 * Admin routes module that provides administrative endpoints.
 * Contains controllers for managing API ...
 */
@Module({
  controllers: [
    ApiKeyAdminController,
    SessionAdminController,
    ActivityLogAdminController,
    DeviceAdminController,
  ],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    ActivityLogModule,
    SessionModule,
    ApiKeyModule,
    DeviceModule,
  ],
})
export class RoutesAdminModule {}
