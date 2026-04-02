import { VerificationModel } from '../models/verification.model';

export class VerificationMapper {
  static toDomain(prismaData: any): VerificationModel {
    const model = new VerificationModel();
    model.id = prismaData.id;
    model.type = prismaData.type;
    model.to = prismaData.to;
    model.expiredAt = prismaData.expiredAt;
    model.reference = prismaData.reference;
    model.token = prismaData.token;
    model.userId = prismaData.userId;
    model.createdAt = prismaData.createdAt;
    model.updatedAt = prismaData.updatedAt;
    model.createdBy = prismaData.createdBy;
    model.updatedBy = prismaData.updatedBy;
    return model;
  }
}
