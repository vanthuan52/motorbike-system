import { Module } from '@nestjs/common';
import { PartTypeRepositoryModule } from './repository/part-type.repository.module';
import { PartTypeService } from './services/part-type.services';

@Module({
  imports: [PartTypeRepositoryModule],
  controllers: [],
  providers: [PartTypeService],
  exports: [PartTypeRepositoryModule, PartTypeService],
})
export class PartTypeModule {}
