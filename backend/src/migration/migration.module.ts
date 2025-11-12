import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { RoleModule } from '@/modules/role/role.module';
import { UserModule } from '@/modules/user/user.module';
import { MigrationUserSeed } from './seeds/migration.user.seed';
import { MigrationRoleSeed } from './seeds/migration.role.seed';
import { AuthModule } from '@/modules/auth/auth.module';
import { CommonModule } from '@/common/common.module';
import { MigrationPartTypeSeed } from './seeds/migration.part-type.seed';
import { PartTypeModule } from '@/modules/part-type/part-type.module';
import { HiringModule } from '@/modules/hiring/hiring.module';
import { StoreModule } from '@/modules/store/store.module';
import { MigrationHiringSeed } from './seeds/migration.hiring.seed';
import { PartModule } from '@/modules/part/part.module';
import { MigrationStoreSeed } from './seeds/migration.store.seed';
import { MigrationVehicleBrandSeed } from './seeds/migration.brand.seed';
import { VehicleBrandModule } from '@/modules/vehicle-brand/vehicle-brand.module';
import { MigrationPartSeed } from './seeds/migration.part.seed';
import { ServiceChecklistModule } from '@/modules/service-checklist/service-checklist.module';
import { MigrationServiceChecklistSeed } from './seeds/migration.service-checklist.seed';
import { CareAreaModule } from '@/modules/care-area/care-area.module';
import { MigrationCareAreaSeed } from './seeds/migration.care-area.seed';

// TODO: Change With Commander
@Module({
  imports: [
    CommonModule,
    CommandModule,
    AuthModule,
    RoleModule,
    UserModule,
    PartTypeModule,
    HiringModule,
    StoreModule,
    PartModule,
    VehicleBrandModule,
    ServiceChecklistModule,
    CareAreaModule,
  ],
  providers: [
    MigrationRoleSeed,
    MigrationUserSeed,
    MigrationPartTypeSeed,
    MigrationHiringSeed,
    MigrationStoreSeed,
    MigrationVehicleBrandSeed,
    MigrationPartSeed,
    MigrationServiceChecklistSeed,
    MigrationCareAreaSeed,
  ],
  exports: [],
})
export class MigrationModule {}
