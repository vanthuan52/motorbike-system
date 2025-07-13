import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserVehicleRepository } from './user-vehicle.repository';
import {
  UserVehicleEntity,
  UserVehicleSchema,
} from '../entities/user-vehicle.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [UserVehicleRepository],
  exports: [UserVehicleRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: UserVehicleEntity.name, schema: UserVehicleSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class UserVehicleRepositoryModule {}
