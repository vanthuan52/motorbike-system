import { Module } from '@nestjs/common';
import { PartTypeRepositoryModule } from './repository/part-type.repository.module';
import { PartTypeService } from './services/part-type.services';
import { PartTypeUtil } from './utils/part-type.util';

@Module({
  imports: [PartTypeRepositoryModule],
  controllers: [],
  providers: [PartTypeService, PartTypeUtil],
  exports: [PartTypeService, PartTypeUtil],
})
export class PartTypeModule {}
