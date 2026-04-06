import { UserModel } from '../models/user.model';
import { RoleMapper } from '@/modules/role/mappers/role.mapper';
import {
  EnumUserGender,
  EnumUserLoginFrom,
  EnumUserLoginWith,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserStatus,
} from '../enums/user.enum';

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

    user.status = prismaUser.status as EnumUserStatus;
    user.gender = prismaUser.gender as EnumUserGender;

    user.photoCdnUrl = prismaUser.photoCdnUrl ?? undefined;

    user.signUpDate = prismaUser.signUpDate;
    user.signUpFrom = prismaUser.signUpFrom as EnumUserSignUpFrom;
    user.signUpWith = prismaUser.signUpWith as EnumUserSignUpWith;

    user.lastLoginAt = prismaUser.lastLoginAt;
    user.lastLoginFrom = prismaUser.lastLoginFrom as EnumUserLoginFrom;
    user.lastLoginWith = prismaUser.lastLoginWith as EnumUserLoginWith;

    user.createdAt = prismaUser.createdAt;
    user.updatedAt = prismaUser.updatedAt;
    user.deletedAt = prismaUser.deletedAt;

    user.createdBy = prismaUser.createdBy;
    user.updatedBy = prismaUser.updatedBy;
    user.deletedBy = prismaUser.deletedBy;

    if (prismaUser.userRoles && Array.isArray(prismaUser.userRoles)) {
      user.roles = prismaUser.userRoles
        .filter((ur: any) => ur.role && !ur.revokedAt)
        .map((ur: any) => RoleMapper.toDomain(ur.role));
    }

    return user;
  }
}
