import { Module } from '@nestjs/common';
import { PartRepositoryModule } from './respository/part.repository.module';
import { PartService } from './services/part.services';

@Module({
  imports: [PartRepositoryModule],
  controllers: [],
  providers: [PartService],
  exports: [PartRepositoryModule, PartService],
})
export class PartModule {}
