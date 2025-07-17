import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { UserUserController } from '@/modules/user/controllers/user.user.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { SessionModule } from '@/modules/session/session.module';
import { PartTypeModule } from '@/modules/part-type/part-type.module';
import { HiringUserController } from '@/modules/hiring/controllers/hiring.user.controller';
import { HiringModule } from '@/modules/hiring/hiring.module';
import { UserVehicleUserController } from '@/modules/user-vehicle/controllers/user-vehicle.user.controller';
import { UserVehicleModule } from '@/modules/user-vehicle/user-vehicle';
import { VehicleModelModule } from '@/modules/vehicle-model/vehicle-model.module';

@Module({
  controllers: [
    UserUserController,
    HiringUserController,
    UserVehicleUserController,
  ],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    AuthModule,
    SessionModule,
    ApiKeyModule,
    HiringModule,
    UserVehicleModule,
    VehicleModelModule,
  ],
})
export class RoutesUserModule {}
