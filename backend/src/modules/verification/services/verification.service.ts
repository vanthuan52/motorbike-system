import { Injectable } from '@nestjs/common';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { VerificationRepository } from '@/modules/verification/repositories/verification.repository';
import { UserService } from '@/modules/user/services/user.service';
import { IUserVerificationCreate } from '@/modules/verification/interfaces/verification.interface';
import { VerificationModel } from '../models/verification.model';

@Injectable()
export class VerificationService {
  constructor(
    private readonly verificationRepository: VerificationRepository,
    private readonly userService: UserService
  ) {}

  async findValidEmailToken(token: string): Promise<VerificationModel> {
    return this.verificationRepository.findOneActiveByVerificationEmailToken(
      token
    );
  }

  async findLatestVerificationEmail(
    userId: string
  ): Promise<VerificationModel | null> {
    return this.verificationRepository.findOneLatestByVerificationEmail(userId);
  }

  async confirmUserEmail(
    verificationId: string,
    userId: string,
    requestLog: IRequestLog
  ): Promise<VerificationModel> {
    return this.verificationRepository.verifyEmail(
      verificationId,
      userId,
      requestLog
    );
  }

  /**
   * Mark the user as verified after a successful email confirmation.
   * Calls UserService to respect SoC — no direct cross-module repository access.
   */
  async updateVerified(
    userId: string,
    requestLog: IRequestLog
  ): Promise<{ isVerified: boolean }> {
    const updated = await this.userService.markVerified(userId, requestLog);
    return { isVerified: updated.isVerified };
  }

  /**
   * Create / refresh a verification email record.
   * Exposed here so AuthService does not need to inject VerificationRepository.
   */
  async requestEmailVerification(
    userId: string,
    userEmail: string,
    verification: IUserVerificationCreate,
    requestLog: IRequestLog
  ): Promise<void> {
    await this.verificationRepository.requestVerificationEmail(
      userId,
      userEmail,
      verification,
      requestLog
    );
  }
}
