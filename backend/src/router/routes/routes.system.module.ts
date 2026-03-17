import { Module } from '@nestjs/common';
import { HealthModule } from '@/modules/health/health.module';
import { UserModule } from '@/modules/user/user.module';

/**
 * System routes module that provides system-level endpoints.
 * Contains controllers for user system operations and health checks for monitoring application status.
 */
@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [UserModule, HealthModule],
})
export class RoutesSystemModule {}
