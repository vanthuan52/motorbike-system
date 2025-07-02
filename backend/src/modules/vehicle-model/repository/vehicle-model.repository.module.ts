import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleModelRepository } from './vehicle-model.repository';
import {
  VehicleModelEntity,
  VehicleModelSchema,
} from '../entities/vehicle-model.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [VehicleModelRepository],
  exports: [VehicleModelRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: VehicleModelEntity.name, schema: VehicleModelSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class VehicleModelRepositoryModule {}
