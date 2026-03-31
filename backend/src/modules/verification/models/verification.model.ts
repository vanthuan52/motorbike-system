import { EnumVerificationType } from '../enums/verification.enum';

/**
 * Domain model representing a verification token (email, phone, etc.).
 * Maps from Prisma Verification to application domain layer.
 */
export class VerificationModel {
  id: string;
  type: EnumVerificationType;
  to: string;
  expiredAt: Date;
  expiredInMinutes: number;
  resendInMinutes: number;
  reference: string;
  token: string;
  hashedToken: string;
  link?: string;
  encryptedLink?: string;

  userId: string;

  createdAt: Date;
  updatedAt: Date;

  createdBy?: string;
  updatedBy?: string;

  constructor(data?: Partial<VerificationModel>) {
    Object.assign(this, data);
  }

  isExpired(): boolean {
    return this.expiredAt < new Date();
  }
}
