import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { CareRecordServiceRepository } from './care-record-service.repository';
import {
  CareRecordServiceEntity,
  CareRecordServiceSchema,
} from '../entities/care-record-service.entity';

CareRecordServiceSchema.index({ vehicleService: 1 });
CareRecordServiceSchema.index({ status: 1 });
@Module({
  providers: [CareRecordServiceRepository],
  exports: [CareRecordServiceRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CareRecordServiceEntity.name,
          schema: CareRecordServiceSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CareRecordServiceRepositoryModule {}
