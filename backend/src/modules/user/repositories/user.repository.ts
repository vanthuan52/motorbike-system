import { Injectable } from '@nestjs/common';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';
import { HelperService } from '@/common/helper/services/helper.service';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IUserListFilters } from '@/modules/user/interfaces/user.filter.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { IAuthPassword } from '@/modules/auth/interfaces/auth.interface';
import { IRole } from '@/modules/role/interfaces/role.interface';
import { UserClaimUsernameRequestDto } from '@/modules/user/dtos/request/user.claim-username.request.dto';
import { UserCreateRequestDto } from '@/modules/user/dtos/request/user.create.request.dto';
import { UserImportRequestDto } from '@/modules/user/dtos/request/user.import.request.dto';
import { UserUpdateProfileRequestDto } from '@/modules/user/dtos/request/user.profile.request.dto';
import { UserUpdateStatusRequestDto } from '@/modules/user/dtos/request/user.update-status.request.dto';
import { ForgotPasswordMapper } from '../mappers/forgot-password.mapper';
import { ForgotPasswordModel } from '../models/forgot-password.model';
import {
  IUserForgotPasswordCreate,
  IUserProfile,
} from '@/modules/user/interfaces/user.interface';
import { AuthCreateSocialRequestDto } from '@/modules/auth/dtos/request/auth.create-social.request.dto';
import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserStatus,
} from '@/modules/user/enums/user.enum';
import { UserModel } from '@/modules/user/models/user.model';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { IUserLoginMetadataUpdate } from '@/modules/user/interfaces/user.interface';
import { EnumPasswordHistoryType } from '@/modules/password-history/enums/password-history.enum';
import { Prisma, User as PrismaUser } from '@/generated/prisma-client';

@Injectable()
export class UserRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly databaseUtil: DatabaseUtil,
    private readonly paginationService: PaginationService,
    private readonly helperService: HelperService
  ) {}

  async updateVerificationStatus(
    userId: string,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;
    const result = await db.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        isVerified: true,
        updatedBy: userId,
      },
      include: {
        role: true,
      },
    });

    return UserMapper.toDomain(result);
  }

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<Prisma.UserSelect, Prisma.UserWhereInput>,
    filters?: IUserListFilters
  ): Promise<IPaginationOffsetReturn<UserModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaUser,
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >(this.databaseService.user, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map((item: PrismaUser) =>
        UserMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<Prisma.UserSelect, Prisma.UserWhereInput>,
    filters?: IUserListFilters
  ): Promise<IPaginationCursorReturn<UserModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaUser,
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >(this.databaseService.user, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => UserMapper.toDomain(item)),
    };
  }

  async findByEmails(emails: string[]): Promise<UserModel[]> {
    const results = await this.databaseService.user.findMany({
      where: {
        email: { in: emails },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return results.map((item: PrismaUser) => UserMapper.toDomain(item));
  }

  async findExport(
    filters?: IUserListFilters
  ): Promise<UserModel[]> {
    const results = await this.databaseService.user.findMany({
      where: {
        ...filters,
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return results.map((item: PrismaUser) => UserMapper.toDomain(item));
  }

  async findActive(): Promise<UserModel[]> {
    const results = await this.databaseService.user.findMany({
      where: {
        status: EnumUserStatus.active,
        deletedAt: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return results.map((item: PrismaUser) => UserMapper.toDomain(item));
  }

  async findOneById(id: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneActiveById(id: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { id, deletedAt: null, status: EnumUserStatus.active },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneActiveByEmail(email: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { email, deletedAt: null, status: EnumUserStatus.active },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneByEmail(email: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { email },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneWithRoleByEmail(email: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { email, deletedAt: null },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneProfileById(id: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        role: true,
      },
    });

    return result ? (UserMapper.toDomain(result) as IUserProfile) : null;
  }

  async findOneActiveProfileById(id: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { id, deletedAt: null, status: EnumUserStatus.active },
      include: {
        role: true,
      },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneWithRoleById(id: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        role: true,
      },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneActiveByForgotPasswordToken(
    token: string
  ): Promise<ForgotPasswordModel | null> {
    const today = this.helperService.dateCreate();

    const result = await this.databaseService.forgotPassword.findFirst({
      where: {
        token,
        isUsed: false,
        expiredAt: {
          gt: today,
        },
        user: {
          deletedAt: null,
          status: EnumUserStatus.active,
        },
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    return ForgotPasswordMapper.toDomain(result);
  }

  async findOneLatestByForgotPassword(
    userId: string
  ): Promise<ForgotPasswordModel | null> {
    const result = await this.databaseService.forgotPassword.findFirst({
      where: {
        userId,
        user: {
          deletedAt: null,
          status: EnumUserStatus.active,
        },
      },
      orderBy: {
        createdAt: EnumPaginationOrderDirectionType.desc,
      },
    });

    return ForgotPasswordMapper.toDomain(result);
  }

  async existByEmail(email: string): Promise<boolean> {
    return (
      this.databaseService.user.count({
        where: { email: email },
      }) > 0
    );
  }

  async existByUsername(username: string): Promise<{ id: string } | null> {
    return this.databaseService.user.findUnique({
      where: { username },
      select: { id: true },
    });
  }

  async createByAdmin(
    userId: string,
    username: string,
    { email, name }: UserCreateRequestDto,
    {
      passwordCreated,
      passwordExpired,
      passwordHash,
      passwordPeriodExpired,
    }: IAuthPassword,
    { id: roleId, type: roleType }: IRole,
    createdBy: string,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;
    const user = await db.user.create({
      data: {
        id: userId,
        email,
        roleId,
        name,
        signUpFrom: EnumUserSignUpFrom.admin,
        signUpWith: EnumUserSignUpWith.credential,
        passwordCreated,
        passwordExpired,
        password: passwordHash,
        passwordAttempt: 0,
        username,
        isVerified: roleType === 'user' ? false : true,
        status: EnumUserStatus.active,
        createdBy,
        deletedAt: null,
        passwordHistories: {
          create: {
            password: passwordHash,
            type: EnumPasswordHistoryType.admin,
            expiredAt: passwordPeriodExpired,
            createdAt: passwordCreated,
            createdBy,
          },
        },
      },
    });

    return user;
  }

  async updateStatusByAdmin(
    id: string,
    { status }: UserUpdateStatusRequestDto,
    updatedBy: string
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id, deletedAt: null },
      data: {
        status,
        updatedBy,
      },
    });

    return UserMapper.toDomain(result);
  }

  async updateProfile(
    userId: string,
    { ...data }: UserUpdateProfileRequestDto
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        ...data,
        updatedBy: userId,
      },
    });

    return UserMapper.toDomain(result);
  }

  async updatePhotoProfile(
    userId: string,
    photo: AwsS3Dto
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        photo: this.databaseUtil.toPlainObject(photo),
        updatedBy: userId,
      },
    });

    return UserMapper.toDomain(result);
  }

  async deleteSelf(
    userId: string,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;
    const deletedAt = this.helperService.dateCreate();
    const result = await db.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        deletedAt,
        deletedBy: userId,
        updatedBy: userId,
        status: EnumUserStatus.inactive,
      },
    });

    return UserMapper.toDomain(result);
  }

  async claimUsername(
    userId: string,
    { username }: UserClaimUsernameRequestDto
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        username,
        updatedBy: userId,
      },
    });

    return UserMapper.toDomain(result);
  }

  async updatePasswordByAdmin(
    userId: string,
    {
      passwordCreated,
      passwordExpired,
      passwordHash,
      passwordPeriodExpired,
    }: IAuthPassword,
    updatedBy: string,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;
    const result = await db.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        password: passwordHash,
        passwordCreated,
        passwordExpired,
        passwordAttempt: 0,
        updatedBy,
        passwordHistories: {
          create: {
            password: passwordHash,
            type: EnumPasswordHistoryType.admin,
            expiredAt: passwordPeriodExpired,
            createdAt: passwordCreated,
            createdBy: updatedBy,
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async increasePasswordAttempt(userId: string): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        passwordAttempt: {
          increment: 1,
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async resetPasswordAttempt(userId: string): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        passwordAttempt: 0,
      },
    });

    return UserMapper.toDomain(result);
  }

  async changePassword(
    userId: string,
    {
      passwordCreated,
      passwordExpired,
      passwordHash,
      passwordPeriodExpired,
    }: IAuthPassword,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;
    const result = await db.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        password: passwordHash,
        passwordCreated,
        passwordExpired,
        passwordAttempt: 0,
        updatedBy: userId,
        passwordHistories: {
          create: {
            password: passwordHash,
            type: EnumPasswordHistoryType.profile,
            expiredAt: passwordPeriodExpired,
            createdAt: passwordCreated,
            createdBy: userId,
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async updateLoginMetadata(
    userId: string,
    { loginFrom, loginWith }: IUserLoginMetadataUpdate,
    ipAddress: string,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;
    const today = this.helperService.dateCreate();

    const result = await db.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        lastLoginAt: today,
        lastIPAddress: ipAddress,
        lastLoginFrom: loginFrom,
        lastLoginWith: loginWith,
        updatedBy: userId,
      },
    });

    return UserMapper.toDomain(result);
  }

  async createFromSocial(
    email: string,
    username: string,
    roleId: string,
    loginWith: EnumUserLoginWith,
    { name, from }: AuthCreateSocialRequestDto,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;
    const userId = this.databaseUtil.createId();
    const signUpWith =
      loginWith === EnumUserLoginWith.socialApple
        ? EnumUserSignUpWith.socialApple
        : EnumUserSignUpWith.socialGoogle;

    const user = await db.user.create({
      data: {
        id: userId,
        email,
        name,
        userRoles: {
          create: {
            roleId,
            assignedBy: userId,
          },
        },
        signUpFrom: from,
        signUpWith,
        username,
        isVerified: true,
        status: EnumUserStatus.active,
        createdBy: userId,
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return user;
  }

  async createFromRegistration(
    userId: string,
    username: string,
    roleId: string,
    { email, name, from }: AuthSignUpRequestDto,
    { passwordHash }: IAuthPassword,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;
    const user = await db.user.create({
      data: {
        id: userId,
        email,
        name,
        userRoles: {
          create: {
            roleId,
            assignedBy: userId,
          },
        },
        signUpFrom: from,
        signUpWith: EnumUserSignUpWith.credential,
        username,
        isVerified: false,
        status: EnumUserStatus.active,
        password: passwordHash,
        passwordAttempt: 0,
        createdBy: userId,
        deletedAt: null,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return user;
  }

  async createForgotPasswordRequest(
    userId: string,
    email: string,
    { expiredAt, reference, hashedToken }: IUserForgotPasswordCreate
  ): Promise<void> {
    await this.databaseService.user.update({
      where: {
        id: userId,
        deletedAt: null,
        status: EnumUserStatus.active,
      },
      data: {
        forgotPasswords: {
          updateMany: {
            where: { isUsed: false },
            data: { isUsed: true },
          },
          create: {
            expiredAt,
            reference,
            token: hashedToken,
            createdBy: userId,
            to: email,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return;
  }

  async resetPassword(
    userId: string,
    forgotPasswordId: string,
    { passwordCreated, passwordHash }: IAuthPassword,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;

    const result = await db.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        password: passwordHash,
        passwordCreated,
        passwordAttempt: 0,
        updatedBy: userId,
        forgotPasswords: {
          update: {
            where: { id: forgotPasswordId },
            data: {
              isUsed: true,
              resetAt: passwordCreated,
            },
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async reachMaxPasswordAttempt(
    userId: string,
    options?: IDatabaseOptions
  ): Promise<UserModel> {
    const db = options?.tx || this.databaseService;
    const result = await db.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        status: EnumUserStatus.inactive,
      },
    });

    return UserMapper.toDomain(result);
  }

  async importByAdmin(
    data: UserImportRequestDto[],
    usernames: string[],
    passwordHasheds: IAuthPassword[],
    { id: roleId, type: roleType }: IRole,
    createdBy: string,
    options?: IDatabaseOptions
  ): Promise<UserModel[]> {
    const db = options?.tx || this.databaseService;
    const usersToCreate: Prisma.PrismaPromise<UserModel>[] = [];

    for (const [index, { email, name }] of data.entries()) {
      const userId = this.databaseUtil.createId();
      const username = usernames[index];
      const {
        passwordCreated,
        passwordExpired,
        passwordHash,
        passwordPeriodExpired,
      } = passwordHasheds[index];

      usersToCreate.push(
        db.user.create({
          data: {
            id: userId,
            email,
            roleId,
            name,
            signUpFrom: EnumUserSignUpFrom.admin,
            signUpWith: EnumUserSignUpWith.credential,
            passwordCreated,
            passwordExpired,
            password: passwordHash,
            passwordAttempt: 0,
            username,
            isVerified: roleType === 'user' ? false : true,
            status: EnumUserStatus.active,
            createdBy,
            deletedAt: null,
            passwordHistories: {
              create: {
                password: passwordHash,
                type: EnumPasswordHistoryType.admin,
                expiredAt: passwordPeriodExpired,
                createdAt: passwordCreated,
                createdBy,
              },
            },
          },
        })
      );
    }

    const users = await Promise.all(usersToCreate);
    return users.map((user: PrismaUser) => UserMapper.toDomain(user));
  }
}
