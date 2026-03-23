import { Module } from '@nestjs/common';
import { StoreService } from './services/store.services';
import { StoreUtil } from './utils/store.util';

@Module({
  imports: [],
  controllers: [],
  providers: [StoreService, StoreUtil],
  exports: [StoreService, StoreUtil],
})
export class StoreModule {}
