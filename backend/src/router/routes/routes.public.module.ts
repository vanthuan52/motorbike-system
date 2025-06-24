import { Module } from '@nestjs/common';
import { HelloPublicController } from '@/modules/hello/controllers/hello.public.controller';
import { AuthPublicController } from '@/modules/auth/controllers/auth.public.controller';
import { UserModule } from '@/modules/user/user.module';
import { RoleModule } from '@/modules/role/role.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionModule } from '@/modules/session/session.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { FilePublicController } from '@/common/file/controllers/file.public.controller';
import { AwsModule } from '@/modules/aws/aws.module';
import { CandidatePublicController } from '@/modules/hiring/controllers/candidate.public.controller';
import { HiringModule } from '@/modules/hiring/hiring.module';
import { HiringPublicController } from '@/modules/hiring/controllers/hiring.public.controller';
import { PartTypePublicController } from '@/modules/part-type/controllers/part-type.public.controller';
import { PartTypeModule } from '@/modules/part-type/part-type.module';

@Module({
  controllers: [
    HelloPublicController,
    AuthPublicController,
    FilePublicController,
    PartTypePublicController,
    CandidatePublicController,
    HiringPublicController,
  ],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    RoleModule,
    AwsModule,
    AuthModule,
    SessionModule,
    PartTypeModule,
    ApiKeyModule,
    HiringModule,
  ],
})
export class RoutesPublicModule {}
