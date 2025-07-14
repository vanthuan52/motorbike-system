import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { CareRecordRepository } from './care-record.repository';
import {
  CareRecordEntity,
  CareRecordSchema,
} from '../entities/care-record.entity';

CareRecordSchema.index({ technician: 1 });
CareRecordSchema.index({ userVehicle: 1 });
CareRecordSchema.index({ appointment: 1 });
CareRecordSchema.index({ status: 1 });
CareRecordSchema.index({ paymentStatus: 1 });
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
