import { Module } from '@nestjs/common';
import { PasswordHistoryService } from './services/password-history.service';
import { PasswordHistoryRepository } from './repositories/password-history.repository';
import { PasswordHistoryUtil } from './utils/password-history.util';

@Module({
  imports: [],
  exports: [
    PasswordHistoryService,
    PasswordHistoryRepository,
    PasswordHistoryUtil,
  ],
  providers: [
    PasswordHistoryService,
    PasswordHistoryRepository,
    PasswordHistoryUtil,
  ],
  controllers: [],
})
export class PasswordHistoryModule {}
