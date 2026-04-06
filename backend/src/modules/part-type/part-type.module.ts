import { Module } from '@nestjs/common';
import { PartTypeAdminController } from './controllers/part-type.admin.controller';
import { PartTypeService } from './services/part-type.services';
import { PartTypeRepository } from './repository/part-type.repository';
import { PartTypeUtil } from './utils/part-type.util';

@Module({
  imports: [],
  controllers: [PartTypeAdminController],
  providers: [PartTypeService, PartTypeRepository, PartTypeUtil],
  exports: [PartTypeService, PartTypeRepository, PartTypeUtil],
})
export class PartTypeModule {}
