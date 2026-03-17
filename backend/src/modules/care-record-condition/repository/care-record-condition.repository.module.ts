import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import {
  CareRecordConditionEntity,
  CareRecordConditionSchema,
} from '../entities/care-record-condition.entity';
import { CareRecordConditionRepository } from './care-record-condition.repository';

@Module({
  providers: [CareRecordConditionRepository],
  exports: [CareRecordConditionRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CareRecordConditionEntity.name,
          schema: CareRecordConditionSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CareRecordConditionRepositoryModule {}
