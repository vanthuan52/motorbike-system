import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';

/**
 * User routes module that provides user-specific endpoints.
 * Contains controllers for user operations that require user-level authentication and authorization.
 */
@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [UserModule],
})
export class RoutesUserModule {}
