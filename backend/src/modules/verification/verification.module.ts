import { Module } from '@nestjs/common';
import { VerificationRepository } from '@/modules/verification/repositories/verification.repository';
import { VerificationService } from '@/modules/verification/services/verification.service';
import { VerificationUtil } from '@/modules/verification/utils/verification.util';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [VerificationRepository, VerificationService, VerificationUtil],
  exports: [VerificationRepository, VerificationService, VerificationUtil],
  controllers: [],
})
export class VerificationModule {}
