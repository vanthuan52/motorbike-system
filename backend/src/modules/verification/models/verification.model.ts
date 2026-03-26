import { EnumVerificationType } from '../enums/verification.enum';

export class VerificationModel {
  type: EnumVerificationType;
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
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
}
