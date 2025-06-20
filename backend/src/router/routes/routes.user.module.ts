import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { UserUserController } from '@/modules/user/controllers/user.user.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { SessionModule } from '@/modules/session/session.module';
import { PartTypeModule } from '@/modules/part-type/part-type.module';
import { PartTypeUserController } from '@/modules/part-type/controllers/part-type.user.controller';
import { HiringUserController } from '@/modules/hiring/controllers/hiring.user.controller';
import { HiringModule } from '@/modules/hiring/hiring.module';

@Module({
  controllers: [
    UserUserController,
    PartTypeUserController,
    HiringUserController,
  ],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    AuthModule,
    SessionModule,
    ApiKeyModule,
    PartTypeModule,
    HiringModule,
  ],
})
export class RoutesUserModule {}
