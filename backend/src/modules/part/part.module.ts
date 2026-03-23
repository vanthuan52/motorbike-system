import { Module } from '@nestjs/common';
import { PartService } from './services/part.services';
import { PartUtil } from './utils/part.util';
import { PartTypeModule } from '../part-type/part-type.module';
import { VehicleBrandModule } from '../vehicle-brand/vehicle-brand.module';

@Module({
  imports: [PartTypeModule, VehicleBrandModule],
  controllers: [],
  providers: [PartService, PartUtil],
  exports: [PartService, PartUtil],
})
export class PartModule {}
