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
import { CareRecordMediaSharedController } from '@/modules/care-record-media/controllers/care-record-media.shared.controller';
import { CareRecordMediaModule } from '@/modules/care-record-media/care-record-media.module';
import { CareRecordItemModule } from '@/modules/care-record-item/care-record-item.module';
import { CareRecordItemSharedController } from '@/modules/care-record-item/controllers/care-record-item.shared.controller';
import { VehicleServiceModule } from '@/modules/vehicle-service/vehicle-service.module';
import { PartModule } from '@/modules/part/part.module';
import { UserVehicleSharedController } from '@/modules/user-vehicle/controllers/user-vehicle.shared.controller';
import { ConversationSharedController } from '@/modules/chat/controllers/conversation.shared.controller';
import { ChatModule } from '@/modules/chat/chat.module';
import { MessageSharedController } from '@/modules/chat/controllers/message.shared.controller';
import { RoleModule } from '@/modules/role/role.module';
import { VehicleModelModule } from '@/modules/vehicle-model/vehicle-model.module';
import { AppointmentSharedController } from '@/modules/appointment/controllers/appointment.shared.controller';
import { CareRecordConditionModule } from '@/modules/care-record-condition/care-record-condition.module';
import { CareRecordConditionSharedController } from '@/modules/care-record-condition/controllers/care-record-condition.shared.controller';
import { CareAreaModule } from '@/modules/care-area/care-area.module';
import { CareAreaSharedController } from '@/modules/care-area/controllers/care-area.shared.controller';

@Module({
  controllers: [
    SessionSharedController,
    UserSharedController,
    AuthSharedController,
    ServiceChecklistSharedController,
    CareRecordSharedController,
    CareRecordChecklistSharedController,
    CareRecordMediaSharedController,
    CareRecordItemSharedController,
    UserVehicleSharedController,
    MessageSharedController,
    ConversationSharedController,
    AppointmentSharedController,
    CareRecordConditionSharedController,
    CareAreaSharedController,
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
    VehicleServiceModule,
    PartModule,
    CareRecordModule,
    CareRecordConditionModule,
    CareRecordChecklistModule,
    CareRecordMediaModule,
    CareRecordItemModule,
    UserVehicleModule,
    ChatModule,
    RoleModule,
    VehicleModelModule,
    CareAreaModule,
  ],
})
export class RoutesSharedModule {}
