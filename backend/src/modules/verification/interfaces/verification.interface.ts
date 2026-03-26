import { EnumVerificationType } from '@/modules/verification/enums/verification.enum';
import { VerificationModel } from '../models/verification.model';

export interface IVerification extends VerificationModel {}

export interface IUserVerificationCreate {
  type: EnumVerificationType;
  expiredAt: Date;
  expiredInMinutes: number;
  resendInMinutes: number;
  reference: string;
  token: string;
  hashedToken: string;
  link?: string;
  encryptedLink?: string;
}
