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
import { StorePublicController } from '@/modules/store/controllers/store.public.controller';
import { PartTypePublicController } from '@/modules/part-type/controllers/part-type.public.controller';
import { PartTypeModule } from '@/modules/part-type/part-type.module';
import { StoreModule } from '@/modules/store/store.module';
import { ServiceCategoryPublicController } from '@/modules/service-category/controllers/service-category.public.controller';
import { ServiceCategoryModule } from '@/modules/service-category/service-category.module';
import { VehicleServicePublicController } from '@/modules/vehicle-service/controllers/vehicle-service.public.controller';
import { VehicleServiceModule } from '@/modules/vehicle-service/vehicle-service.module';

@Module({
  controllers: [
    HelloPublicController,
    AuthPublicController,
    FilePublicController,
    PartTypePublicController,
    CandidatePublicController,
    HiringPublicController,
    StorePublicController,
    ServiceCategoryPublicController,
    VehicleServicePublicController,
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
    StoreModule,
    ServiceCategoryModule,
    VehicleServiceModule,
  ],
})
export class RoutesPublicModule {}
