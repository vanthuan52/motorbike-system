import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { CareRecordRepository } from './care-record.repository';
import {
  CareRecordEntity,
  CareRecordSchema,
} from '../entities/care-record.entity';

CareRecordSchema.index(
  {
    vehicleService: 1,
    vehicleModel: 1,
    dateStart: 1,
    dateEnd: 1,
  },
  {
    name: 'idx_service_price_date_range',
  },
);

CareRecordSchema.index({ vehicleService: 1 });
CareRecordSchema.index({ vehicleModel: 1 });
CareRecordSchema.index({ dateStart: 1 });
CareRecordSchema.index({ dateEnd: 1 });

@Module({
  providers: [CareRecordRepository],
  exports: [CareRecordRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: CareRecordEntity.name, schema: CareRecordSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CareRecordRepositoryModule {}
