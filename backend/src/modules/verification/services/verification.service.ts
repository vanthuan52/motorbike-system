import { Injectable } from '@nestjs/common';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { VerificationRepository } from '@/modules/verification/repositories/verification.repository';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { Verification } from '@/generated/prisma-client';
import { IUser } from '@/modules/user/interfaces/user.interface';

@Injectable()
export class VerificationService {
  constructor(
    private readonly verificationRepository: VerificationRepository,
    private readonly userRepository: UserRepository
  ) {}

  async findValidEmailToken(token: string): Promise<any> {
    return this.verificationRepository.findOneActiveByVerificationEmailToken(
      token
    );
  }

  async confirmUserEmail(
    verificationId: string,
    userId: string,
    requestLog: IRequestLog
  ): Promise<Verification> {
    return this.verificationRepository.verifyEmail(
      verificationId,
      userId,
      requestLog
    );
  }

  async updateVerified(
    userId: string,
    requestLog: IRequestLog
  ): Promise<IUser> {
    return this.userRepository.verify(userId, requestLog);
  }
}
