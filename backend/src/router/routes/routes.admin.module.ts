import { Module } from '@nestjs/common';
import { RoleAdminController } from '@/modules/role/controllers/role.admin.controller';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { UserAdminController } from '@/modules/user/controllers/user.admin.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionModule } from '@/modules/session/session.module';
import { ApiKeyAdminController } from '@/modules/api-key/controllers/api-key.admin.controller';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { SessionAdminController } from '@/modules/session/controllers/session.admin.controller';
import { AuthAdminController } from '@/modules/auth/controllers/auth.admin.controller';
import { PartTypeModule } from '@/modules/part-type/part-type.module';
import { PartTypeAdminController } from '@/modules/part-type/controllers/part-type.admin.controller';
import { HiringAdminController } from '@/modules/hiring/controllers/hiring.admin.controller';
import { HiringModule } from '@/modules/hiring/hiring.module';
import { CandidateAdminController } from '@/modules/hiring/controllers/candidate.admin.controller';
import { StoreAdminController } from '@/modules/store/controllers/store.admin.controller';
import { CandidateReviewAdminController } from '@/modules/hiring/controllers/candidate-review.admin.controller';
import { PartAdminController } from '@/modules/part/controllers/part.admin.controller';
import { PartModule } from '@/modules/part/part.module';
import { StoreModule } from '@/modules/store/store.module';
import { ServiceCategoryAdminController } from '@/modules/service-category/controllers/service-category.admin.controller';
import { ServiceCategoryModule } from '@/modules/service-category/service-category.module';
import { VehicleServiceAdminController } from '@/modules/vehicle-service/controllers/vehicle-service.admin.controller';
import { VehicleServiceModule } from '@/modules/vehicle-service/vehicle-service.module';

@Module({
  controllers: [
    RoleAdminController,
    UserAdminController,
    AuthAdminController,
    ApiKeyAdminController,
    SessionAdminController,
    PartTypeAdminController,
    HiringAdminController,
    CandidateAdminController,
    CandidateReviewAdminController,
    ServiceCategoryAdminController,
    StoreAdminController,
    PartAdminController,
    VehicleServiceAdminController,
  ],
  providers: [],
  exports: [],
  imports: [
    RoleModule,
    UserModule,
    AuthModule,
    SessionModule,
    ApiKeyModule,
    SessionModule,
    PartTypeModule,
    HiringModule,
    StoreModule,
    ServiceCategoryModule,
    PartModule,
    VehicleServiceModule,
  ],
})
export class RoutesAdminModule {}
