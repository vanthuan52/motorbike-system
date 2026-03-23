import { Module } from '@nestjs/common';
import { PartTypeService } from './services/part-type.services';
import { PartTypeUtil } from './utils/part-type.util';

@Module({
  imports: [],
  controllers: [],
  providers: [PartTypeService, PartTypeUtil],
  exports: [PartTypeService, PartTypeUtil],
})
export class PartTypeModule {}
