import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { CareRecordMediaRepository } from './care-record-media.repository';
import {
  CareRecordMediaEntity,
  CareRecordMediaSchema,
} from '../entities/care-record-media.entity';

CareRecordMediaSchema.index({ stage: 1 });
CareRecordMediaSchema.index({ type: 1 });
@Module({
  providers: [CareRecordMediaRepository],
  exports: [CareRecordMediaRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: CareRecordMediaEntity.name, schema: CareRecordMediaSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CareRecordMediaRepositoryModule {}
