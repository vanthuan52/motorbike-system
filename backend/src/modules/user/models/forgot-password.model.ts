import { UserModel } from './user.model';

/**
 * Domain model representing a ForgotPassword record.
 * Maps from Prisma ForgotPassword to application domain layer.
 */
export class ForgotPasswordModel {
  id: string;
  userId: string;
  to: string;
  token: string;
  expiredAt: Date;
  resetAt?: Date;
  isUsed: boolean;
  reference: string;

  // timestamps fields
  createdAt: Date;
  createdBy?: string;

  // relation
  user?: UserModel;
}
