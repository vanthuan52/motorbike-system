import { ForgotPasswordModel } from '../models/forgot-password.model';
import { UserMapper } from './user.mapper';

export class ForgotPasswordMapper {
  /**
   * Maps a Prisma ForgotPassword to domain ForgotPasswordModel.
   */
  static toDomain(prismaData: any): ForgotPasswordModel | null {
    if (!prismaData) {
      return null;
    }

    const model = new ForgotPasswordModel();
    model.id = prismaData.id;
    model.userId = prismaData.userId;
    model.to = prismaData.to;
    model.token = prismaData.token;
    model.expiredAt = prismaData.expiredAt;
    model.resetAt = prismaData.resetAt;
    model.isUsed = prismaData.isUsed;
    model.reference = prismaData.reference;

    model.createdAt = prismaData.createdAt;
    model.createdBy = prismaData.createdBy;

    if (prismaData.user) {
      model.user = UserMapper.toDomain(prismaData.user);
    }

    return model;
  }
}
