import { Module } from '@nestjs/common';
import { PartService } from './services/part.services';
import { PartUtil } from './utils/part.util';
import { PartTypeModule } from '../part-type/part-type.module';
import { VehicleBrandModule } from '../vehicle-brand/vehicle-brand.module';
import { PartRepository } from './respository/part.repository';

@Module({
  imports: [PartTypeModule, VehicleBrandModule],
  controllers: [],
  providers: [PartService, PartUtil, PartRepository],
  exports: [PartService, PartUtil, PartRepository],
})
export class PartModule {}
