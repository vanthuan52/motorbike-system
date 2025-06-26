import { Module } from '@nestjs/common';
import { StoreRepositoryModule } from './repository/store.repository.module';
import { StoreService } from './services/store.services';
import { MessageModule } from '@/common/message/message.module';

@Module({
  imports: [StoreRepositoryModule, MessageModule],
  controllers: [],
  providers: [StoreService],
  exports: [StoreRepositoryModule, StoreService],
})
export class StoreModule {}
