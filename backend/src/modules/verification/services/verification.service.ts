import { Injectable } from '@nestjs/common';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { VerificationRepository } from '@/modules/verification/repositories/verification.repository';
import { UserService } from '@/modules/user/services/user.service';
import { IUserVerificationCreate } from '@/modules/verification/interfaces/verification.interface';
import { VerificationModel } from '../models/verification.model';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';

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
    options?: IDatabaseOptions
  ): Promise<VerificationModel> {
    return this.verificationRepository.verifyEmail(verificationId, options);
  }

  /**
   * Create / refresh a verification email record.
   * Exposed here so AuthService does not need to inject VerificationRepository.
   */
  async requestEmailVerification(
    userId: string,
    userEmail: string,
    verification: IUserVerificationCreate,
    options?: IDatabaseOptions
  ): Promise<void> {
    await this.verificationRepository.requestVerificationEmail(
      userId,
      userEmail,
      verification,
      options
    );
  }
}
