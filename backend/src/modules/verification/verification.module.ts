import { Module } from '@nestjs/common';
import { VerificationRepository } from '@/modules/verification/repositories/verification.repository';
import { VerificationService } from '@/modules/verification/services/verification.service';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [VerificationRepository, VerificationService],
  exports: [VerificationRepository, VerificationService],
  controllers: [],
})
export class VerificationModule {}
