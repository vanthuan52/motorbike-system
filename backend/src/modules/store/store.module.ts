import { Module } from '@nestjs/common';
import { StoreService } from './services/store.services';
import { StoreRepository } from './repository/store.repository';
import { StoreUtil } from './utils/store.util';

@Module({
  imports: [],
  controllers: [],
  providers: [StoreRepository, StoreService, StoreUtil],
  exports: [StoreService, StoreUtil],
})
export class StoreModule {}
