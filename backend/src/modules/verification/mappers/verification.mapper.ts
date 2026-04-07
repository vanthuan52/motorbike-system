import { VerificationModel } from '../models/verification.model';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { Verification as PrismaVerification } from '@/generated/prisma-client';

export class VerificationMapper {
  static toDomain(prismaData: PrismaVerification | any): VerificationModel {
    const model = new VerificationModel();
    model.id = prismaData.id;
    model.type = prismaData.type as any;
    model.to = prismaData.to;
    model.expiredAt = prismaData.expiredAt;
    model.expiredInMinutes = prismaData.expiredInMinutes;
    model.resendInMinutes = prismaData.resendInMinutes;
    model.reference = prismaData.reference;
    model.token = prismaData.token;
    model.hashedToken = prismaData.hashedToken;
    model.link = prismaData.link ?? undefined;
    model.encryptedLink = prismaData.encryptedLink ?? undefined;
    model.verifiedAt = prismaData.verifiedAt ?? undefined;
    model.isUsed = prismaData.isUsed ?? undefined;
    model.userId = prismaData.userId;

    if (prismaData.user) {
      model.user = UserMapper.toDomain(prismaData.user);
    }

    model.createdAt = prismaData.createdAt;
    model.updatedAt = prismaData.updatedAt;
    model.createdBy = prismaData.createdBy;
    model.updatedBy = prismaData.updatedBy;
    return model;
  }
}
