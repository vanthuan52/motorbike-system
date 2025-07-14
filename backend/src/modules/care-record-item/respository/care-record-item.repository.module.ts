import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { CareRecordItemRepository } from './care-record-item.repository';
import {
  CareRecordItemEntity,
  CareRecordItemSchema,
} from '../entities/care-record-item.entity';

CareRecordItemSchema.index({ careRecord: 1 });
CareRecordItemSchema.index({ vehicleService: 1 });
CareRecordItemSchema.index({ source: 1 });
CareRecordItemSchema.index({ itemType: 1 });
CareRecordItemSchema.index({ part: 1 });
CareRecordItemSchema.index({ technician: 1 });

@Module({
  providers: [CareRecordItemRepository],
  exports: [CareRecordItemRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CareRecordItemEntity.name,
          schema: CareRecordItemSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CareRecordItemRepositoryModule {}
