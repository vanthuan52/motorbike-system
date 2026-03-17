import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ActivityLogEntity,
  ActivityLogSchema,
} from '../entities/activity-log.entity';
import { ActivityLogRepository } from './activity-log.repository';

@Module({
  providers: [ActivityLogRepository],
  exports: [ActivityLogRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: ActivityLogEntity.name,
        schema: ActivityLogSchema,
      },
    ]),
  ],
})
export class ActivityLogRepositoryModule {}
