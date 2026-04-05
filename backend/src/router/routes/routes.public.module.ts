import { Module } from '@nestjs/common';
import { HelloPublicController } from '@/modules/hello/controllers/hello.public.controller';
import { AuthPublicController } from '@/modules/auth/controllers/auth.public.controller';
import { UserModule } from '@/modules/user/user.module';
import { RoleModule } from '@/modules/role/role.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionModule } from '@/modules/session/session.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { AwsModule } from '@/common/aws/aws.module';
import { JobApplicationPublicController } from '@/modules/job/controllers/job-application.public.controller';
import { JobModule } from '@/modules/job/job.module';
import { JobPublicController } from '@/modules/job/controllers/job.public.controller';
import { StorePublicController } from '@/modules/store/controllers/store.public.controller';
import { PartTypePublicController } from '@/modules/part-type/controllers/part-type.public.controller';
import { PartTypeModule } from '@/modules/part-type/part-type.module';
import { PartPublicController } from '@/modules/part/controllers/part.public.controller';
import { PartModule } from '@/modules/part/part.module';
import { StoreModule } from '@/modules/store/store.module';
import { ServiceCategoryPublicController } from '@/modules/service-category/controllers/service-category.public.controller';
import { ServiceCategoryModule } from '@/modules/service-category/service-category.module';
import { VehicleServicePublicController } from '@/modules/vehicle-service/controllers/vehicle-service.public.controller';
import { VehicleServiceModule } from '@/modules/vehicle-service/vehicle-service.module';
import { VehicleBrandPublicController } from '@/modules/vehicle-brand/controllers/vehicle-brand.public.controller';
import { VehicleModelPublicController } from '@/modules/vehicle-model/controllers/vehicle-model.public.controller';
import { VehicleBrandModule } from '@/modules/vehicle-brand/vehicle-brand.module';
import { VehicleModelModule } from '@/modules/vehicle-model/vehicle-model.module';
import { ServicePricePublicController } from '@/modules/service-price/controllers/service-price.public.controller';
import { ServicePriceModule } from '@/modules/service-price/service-price.module';
import { AppointmentPublicController } from '@/modules/appointment/controllers/appointment.public.controller';
import { AppointmentModule } from '@/modules/appointment/appointment.module';
import { UserVehicleModule } from '@/modules/user-vehicle/user-vehicle';
import { HelloModule } from '@/modules/hello/hello.module';

/**
 * Public routes module that provides publicly accessible endpoints.
 * Contains controllers for ... that don't require authentication.
 */
@Module({
  controllers: [
    HelloPublicController,
    AuthPublicController,
    PartTypePublicController,
    JobApplicationPublicController,
    JobPublicController,
    StorePublicController,
    ServiceCategoryPublicController,
    PartPublicController,
    VehicleServicePublicController,
    VehicleBrandPublicController,
    VehicleModelPublicController,
    ServicePricePublicController,
    AppointmentPublicController,
  ],
  providers: [],
  exports: [],
  imports: [
    HelloModule,
    UserModule,
    RoleModule,
    AwsModule,
    AuthModule,
    SessionModule,
    PartTypeModule,
    ApiKeyModule,
    JobModule,
    StoreModule,
    ServiceCategoryModule,
    PartModule,
    VehicleServiceModule,
    VehicleBrandModule,
    VehicleModelModule,
    ServicePriceModule,
    AppointmentModule,
    UserVehicleModule,
  ],
})
export class RoutesPublicModule {}
