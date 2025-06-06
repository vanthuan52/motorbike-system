import { Module } from '@nestjs/common';
import { ApiKeyService } from './services/api-key.service';
import { ApiKeyRepositoryModule } from './repositpory/api-key.repository.module';

@Module({
  providers: [ApiKeyService],
  exports: [ApiKeyService],
  controllers: [],
  imports: [ApiKeyRepositoryModule],
})
export class ApiKeyModule {}
