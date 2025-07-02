import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionSharedController } from '@/modules/session/controllers/session.shared.controller';
import { SessionModule } from '@/modules/session/session.module';
import { UserModule } from '@/modules/user/user.module';
import { UserSharedController } from '@/modules/user/controllers/user.shared.controller';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { AuthSharedController } from '@/modules/auth/controllers/auth.shared.controller';
import { AwsModule } from '@/modules/aws/aws.module';
import { PartSharedController } from '@/modules/part/controllers/part.shared.controller';
import { PartModule } from '@/modules/part/part.module';

@Module({
  controllers: [
    SessionSharedController,
    UserSharedController,
    AuthSharedController,
    PartSharedController,
  ],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    AuthModule,
    AwsModule,
    SessionModule,
    ApiKeyModule,
    PartModule,
  ],
})
export class RoutesSharedModule {}
