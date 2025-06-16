import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { UserUserController } from '@/modules/user/controllers/user.user.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { SessionModule } from '@/modules/session/session.module';
import { PartTypeModule } from '@/modules/part-type/part-type.module';
import { PartTypeUserController } from '@/modules/part-type/controllers/part-type.user.controller';

@Module({
  controllers: [UserUserController, PartTypeUserController],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    AuthModule,
    SessionModule,
    ApiKeyModule,
    PartTypeModule,
  ],
})
export class RoutesUserModule {}
