import { UserModel } from '../models/user.model';
import { RoleMapper } from '@/modules/role/mappers/role.mapper';
import {
  EnumUserStatus,
  EnumUserGender,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '../enums/user.enum';
import { User as PrismaUser } from '@/generated/prisma-client';
import { IUser } from '../interfaces/user.interface';

export class UserMapper {
  /**
   * Maps a Prisma User to domain UserModel.
   * If the Prisma result includes userRoles with role, maps them to IUser.roles.
   */
  static toDomain(prismaUser: any): UserModel {
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

  /**
   * Maps a Prisma User with included userRoles→role to IUser with roles array.
   */
  static toDomainWithRoles(prismaUser: any): IUser {
    const user = UserMapper.toDomain(prismaUser) as IUser;

    // Map userRoles relation to roles array
    if (prismaUser.userRoles && Array.isArray(prismaUser.userRoles)) {
      user.roles = prismaUser.userRoles
        .filter((ur: any) => ur.role && !ur.revokedAt)
        .map((ur: any) => RoleMapper.toDomain(ur.role));
    } else {
      user.roles = [];
    }

    return user;
  }
}
