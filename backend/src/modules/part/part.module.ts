import { Module } from '@nestjs/common';
import { PartRepositoryModule } from './respository/part.repository.module';
import { PartService } from './services/part.services';
import { PartUtil } from './utils/part.util';
import { PartTypeModule } from '../part-type/part-type.module';

@Module({
  imports: [PartRepositoryModule, PartTypeModule],
  controllers: [],
  providers: [PartService, PartUtil],
  exports: [PartService, PartUtil],
})
export class PartModule {}
