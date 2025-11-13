import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { CareRecordChecklistRepository } from './care-record-checklist.repository';
import {
  CareRecordChecklistEntity,
  CareRecordChecklistSchema,
} from '../entities/care-record-checklist.entity';

CareRecordChecklistSchema.index({ serviceChecklist: 1 });
CareRecordChecklistSchema.index({ result: 1 });
@Module({
  providers: [CareRecordChecklistRepository],
  exports: [CareRecordChecklistRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CareRecordChecklistEntity.name,
          schema: CareRecordChecklistSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CareRecordChecklistRepositoryModule {}
