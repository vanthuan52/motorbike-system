import { Module } from '@nestjs/common';
import { ApiKeyService } from './services/api-key.service';
import { ApiKeyRepositoryModule } from './repositpory/api-key.repository.module';
import { ApiKeyUtil } from './utils/api-key.util';

@Module({
  imports: [ApiKeyRepositoryModule],
  providers: [ApiKeyService, ApiKeyUtil],
  exports: [ApiKeyService, ApiKeyUtil],
  controllers: [],
})
export class ApiKeyModule {}
