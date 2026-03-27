import { UserModel } from '../models/user.model';
import {
  EnumUserStatus,
  EnumUserGender,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '../enums/user.enum';
import { User as PrismaUser } from '@/generated/prisma-client';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): UserModel {
    const user = new UserModel();
    user.id = prismaUser.id;
    user.username = prismaUser.username;
    user.name = prismaUser.name;
    user.email = prismaUser.email;
    user.phone = prismaUser.phone;
    user.password = prismaUser.password;
    user.isVerified = prismaUser.isVerified;
    user.verifiedAt = prismaUser.verifiedAt;

    user.status = prismaUser.status?.toLowerCase() as EnumUserStatus;
    user.gender = prismaUser.gender?.toLowerCase() as EnumUserGender;

    user.photo = prismaUser.photo;

    user.signUpDate = prismaUser.signUpDate;
    user.signUpFrom =
      prismaUser.signUpFrom?.toLowerCase() as EnumUserSignUpFrom;
    user.signUpWith =
      prismaUser.signUpWith?.toLowerCase() as EnumUserSignUpWith;

    user.lastLoginAt = prismaUser.lastLoginAt;
    user.lastLoginFrom =
      prismaUser.lastLoginFrom?.toLowerCase() as EnumUserLoginFrom;
    user.lastLoginWith =
      prismaUser.lastLoginWith?.toLowerCase() as EnumUserLoginWith;

    user.verification = prismaUser.verification;

    user.createdAt = prismaUser.createdAt;
    user.updatedAt = prismaUser.updatedAt;
    user.deletedAt = prismaUser.deletedAt;

    user.createdBy = prismaUser.createdBy;
    user.updatedBy = prismaUser.updatedBy;
    user.deletedBy = prismaUser.deletedBy;

    return user;
  }
}
