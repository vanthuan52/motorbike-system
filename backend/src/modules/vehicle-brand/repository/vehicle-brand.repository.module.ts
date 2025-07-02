import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleBrandRepository } from './vehicle-brand.repository';
import {
  VehicleBrandEntity,
  VehicleBrandSchema,
} from '../entities/vehicle-brand.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [VehicleBrandRepository],
  exports: [VehicleBrandRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: VehicleBrandEntity.name, schema: VehicleBrandSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class VehicleBrandRepositoryModule {}
