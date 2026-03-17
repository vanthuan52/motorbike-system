import { Module } from '@nestjs/common';
import { StoreRepositoryModule } from './repository/store.repository.module';
import { StoreService } from './services/store.services';
import { StoreUtil } from './utils/store.util';

@Module({
  imports: [StoreRepositoryModule],
  controllers: [],
  providers: [StoreService, StoreUtil],
  exports: [StoreService, StoreUtil],
})
export class StoreModule {}
