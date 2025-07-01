import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleServiceRepository } from './vehicle-service.repository';
import {
  VehicleServiceEntity,
  VehicleServiceSchema,
} from '../entities/vehicle-service.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [VehicleServiceRepository],
  exports: [VehicleServiceRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: VehicleServiceEntity.name, schema: VehicleServiceSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class VehicleServiceRepositoryModule {}
