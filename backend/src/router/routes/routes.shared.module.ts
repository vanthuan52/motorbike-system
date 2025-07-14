import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { SessionSharedController } from '@/modules/session/controllers/session.shared.controller';
import { SessionModule } from '@/modules/session/session.module';
import { UserModule } from '@/modules/user/user.module';
import { UserSharedController } from '@/modules/user/controllers/user.shared.controller';
import { ApiKeyModule } from '@/modules/api-key/api-key.module';
import { AuthSharedController } from '@/modules/auth/controllers/auth.shared.controller';
import { AwsModule } from '@/modules/aws/aws.module';
import { ServiceChecklistSharedController } from '@/modules/service-checklist/controllers/service-checklist.shared.controller';
import { ServiceChecklistModule } from '@/modules/service-checklist/service-checklist.module';
import { CareRecordSharedController } from '@/modules/care-record/controllers/care-record.shared.controller';
import { CareRecordModule } from '@/modules/care-record/care-record.module';
import { CareRecordChecklistModule } from '@/modules/care-record-checklist/care-record-checklist.module';
import { CareRecordChecklistSharedController } from '@/modules/care-record-checklist/controllers/care-record-checklist.shared.controller';
import { AppointmentModule } from '@/modules/appointment/appointment.module';
import { UserVehicleModule } from '@/modules/user-vehicle/user-vehicle';

@Module({
  controllers: [
    SessionSharedController,
    UserSharedController,
    AuthSharedController,
    ServiceChecklistSharedController,
    CareRecordSharedController,
    CareRecordChecklistSharedController,
  ],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    AuthModule,
    AwsModule,
    SessionModule,
    ApiKeyModule,
    ServiceChecklistModule,
    AppointmentModule,
    UserVehicleModule,
    CareRecordModule,
    CareRecordChecklistModule,
  ],
})
export class RoutesSharedModule {}
