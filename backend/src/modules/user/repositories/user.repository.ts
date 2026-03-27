import { Injectable } from '@nestjs/common';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { HelperService } from '@/common/helper/services/helper.service';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import {
  IPaginationCursorReturn,
  IPaginationEqual,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IAuthPassword } from '@/modules/auth/interfaces/auth.interface';
import { DeviceRequestDto } from '@/modules/device/dtos/requests/device.request.dto';
import { IRole } from '@/modules/role/interfaces/role.interface';
import { UserClaimUsernameRequestDto } from '@/modules/user/dtos/request/user.claim-username.request.dto';
import { UserCreateRequestDto } from '@/modules/user/dtos/request/user.create.request.dto';
import { UserImportRequestDto } from '@/modules/user/dtos/request/user.import.request.dto';
import { UserUpdateProfileRequestDto } from '@/modules/user/dtos/request/user.profile.request.dto';
import { UserUpdateStatusRequestDto } from '@/modules/user/dtos/request/user.update-status.request.dto';
import {
  IUserForgotPasswordCreate,
  IUserLogin,
  IUserLoginResult,
  IUserProfile,
} from '@/modules/user/interfaces/user.interface';
import { AuthCreateSocialRequestDto } from '@/modules/auth/dtos/request/auth.create-social.request.dto';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import {
  EnumDeviceNotificationProvider,
  EnumDevicePlatform,
} from '@/modules/device/enums/device.enum';
import {
  EnumNotificationChannel,
  EnumNotificationType,
} from '@/modules/notification/enums/notification.enum';
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import {
  EnumUserLoginWith,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserStatus,
} from '@/modules/user/enums/user.enum';
import { UserModel } from '@/modules/user/models/user.model';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { Prisma, User as PrismaUser } from '@/generated/prisma-client';
import { IUserVerificationCreate } from '@/modules/verification/interfaces/verification.interface';

@Injectable()
export class UserRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly databaseUtil: DatabaseUtil,
    private readonly paginationService: PaginationService,
    private readonly helperService: HelperService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<Prisma.UserSelect, Prisma.UserWhereInput>,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
    country?: Record<string, IPaginationEqual>
  ): Promise<IPaginationOffsetReturn<UserModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaUser,
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >(this.databaseService.user, {
      ...params,
      where: {
        ...where,
        ...status,
        ...country,
        ...role,
        deletedAt: null,
      },
      include: {
        role: true,
        twoFactor: true,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => UserMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<Prisma.UserSelect, Prisma.UserWhereInput>,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
    country?: Record<string, IPaginationEqual>
  ): Promise<IPaginationCursorReturn<UserModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaUser,
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >(this.databaseService.user, {
      ...params,
      where: {
        ...where,
        ...status,
        ...country,
        ...role,
        deletedAt: null,
      },
      include: {
        role: true,
        twoFactor: true,
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
        role: true,
        twoFactor: true,
      },
    });

    return results.map((item: PrismaUser) => UserMapper.toDomain(item));
  }

  async findExport(
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
    country?: Record<string, IPaginationEqual>
  ): Promise<UserModel[]> {
    const results = await this.databaseService.user.findMany({
      where: {
        ...status,
        ...country,
        ...role,
        deletedAt: null,
      },
      include: {
        role: true,
        twoFactor: true,
      },
    });

    return results.map((item: PrismaUser) => UserMapper.toDomain(item));
  }

  async findActive(): Promise<
    {
      id: string;
      email: string;
      username: string;
    }[]
  > {
    return this.databaseService.user.findMany({
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
  }

  async findOneById(id: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { id, deletedAt: null },
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

  async findOneWithRoleByEmail(email: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { email, deletedAt: null },
      include: {
        role: true,
        twoFactor: true,
      },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneProfileById(id: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        role: true,
        country: true,
        twoFactor: true,
        mobileNumbers: {
          include: {
            country: true,
          },
        },
      },
    });

    return result ? (UserMapper.toDomain(result) as IUserProfile) : null;
  }

  async findOneActiveProfileById(id: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { id, deletedAt: null, status: EnumUserStatus.active },
      include: {
        role: true,
        country: true,
        twoFactor: true,
        mobileNumbers: {
          include: {
            country: true,
          },
        },
      },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneWithRoleById(id: string): Promise<UserModel | null> {
    const result = await this.databaseService.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        role: true,
        twoFactor: true,
      },
    });

    return result ? UserMapper.toDomain(result) : null;
  }

  async findOneActiveByForgotPasswordToken(
    token: string
  ): Promise<(Prisma.ForgotPassword & { user: UserModel }) | null> {
    const today = this.helperService.dateCreate();

    return this.databaseService.forgotPassword.findFirst({
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
            twoFactor: true,
          },
        },
      },
    });
  }

  async findOneLatestByForgotPassword(
    userId: string
  ): Promise<Prisma.ForgotPassword | null> {
    return this.databaseService.forgotPassword.findFirst({
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
  }

  async existByEmail(email: string): Promise<{ id: string } | null> {
    return this.databaseService.user.findFirst({
      where: { email: email },
      select: { id: true },
    });
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
    { ipAddress, userAgent, geoLocation }: IRequestLog,
    createdBy: string
  ): Promise<UserModel> {
    const [user] = await this.databaseService.$transaction([
      this.databaseService.user.create({
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
          isVerified: roleType === EnumRoleType.user ? false : true,
          status: EnumUserStatus.active,
          termPolicy: {
            [Prisma.EnumTermPolicyType.cookies]: false,
            [Prisma.EnumTermPolicyType.marketing]: false,
            [Prisma.EnumTermPolicyType.privacy]: true,
            [Prisma.EnumTermPolicyType.termsOfService]: true,
          },
          createdBy,
          deletedAt: null,
          passwordHistories: {
            create: {
              password: passwordHash,
              type: Prisma.EnumPasswordHistoryType.admin,
              expiredAt: passwordPeriodExpired,
              createdAt: passwordCreated,
              createdBy,
            },
          },
          activityLogs: {
            createMany: {
              data: [
                {
                  action: EnumActivityLogAction.userCreated,
                  ipAddress,
                  userAgent: this.databaseUtil.toPlainObject(userAgent),
                  geoLocation: this.databaseUtil.toPlainObject(geoLocation),
                  createdBy,
                },
                {
                  action: EnumActivityLogAction.userSendVerificationEmail,
                  ipAddress,
                  userAgent: this.databaseUtil.toPlainObject(userAgent),
                  geoLocation: this.databaseUtil.toPlainObject(geoLocation),
                  createdBy,
                },
              ],
            },
          },
          notificationSettings: {
            createMany: {
              data: Object.values(EnumNotificationChannel)
                .map(channel =>
                  Object.values(EnumNotificationType).map(type => ({
                    channel,
                    type,
                    isActive: true,
                  }))
                )
                .flat(),
            },
          },
          twoFactor: {
            create: {
              enabled: false,
              requiredSetup: false,
              createdBy,
            },
          },
        },
      }),
    ]);

    return user;
  }

  async updateStatusByAdmin(
    id: string,
    { status }: UserUpdateStatusRequestDto,
    { ipAddress, userAgent, geoLocation }: IRequestLog,
    updatedBy: string
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id, deletedAt: null },
      data: {
        status,
        updatedBy,
        activityLogs: {
          create: {
            action:
              status === EnumUserStatus.blocked
                ? EnumActivityLogAction.userBlocked
                : EnumActivityLogAction.userUpdateStatus,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: updatedBy,
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async updateProfile(
    userId: string,
    { ...data }: UserUpdateProfileRequestDto,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        ...data,
        updatedBy: userId,
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userUpdateProfile,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async updatePhotoProfile(
    userId: string,
    photo: AwsS3Dto,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        photo: this.databaseUtil.toPlainObject(photo),
        updatedBy: userId,
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userUpdatePhotoProfile,
            ipAddress: ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async deleteSelf(
    userId: string,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const deletedAt = this.helperService.dateCreate();
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        deletedAt,
        deletedBy: userId,
        updatedBy: userId,
        status: EnumUserStatus.inactive,
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userDeleteSelf,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
            createdAt: deletedAt,
          },
        },
        sessions: {
          updateMany: {
            where: {
              isRevoked: false,
              expiredAt: { gte: deletedAt },
            },
            data: {
              isRevoked: true,
              revokedAt: deletedAt,
              revokedById: userId,
            },
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async claimUsername(
    userId: string,
    { username }: UserClaimUsernameRequestDto,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        username,
        updatedBy: userId,
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userClaimUsername,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
          },
        },
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
    { ipAddress, userAgent, geoLocation }: IRequestLog,
    updatedBy: string
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
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
            type: Prisma.EnumPasswordHistoryType.admin,
            expiredAt: passwordPeriodExpired,
            createdAt: passwordCreated,
            createdBy: updatedBy,
          },
        },
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userUpdatePasswordByAdmin,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: updatedBy,
          },
        },
        sessions: {
          updateMany: {
            where: {
              isRevoked: false,
              expiredAt: { gte: passwordCreated },
            },
            data: {
              isRevoked: true,
              revokedAt: passwordCreated,
              revokedById: updatedBy,
            },
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
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
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
            type: Prisma.EnumPasswordHistoryType.profile,
            expiredAt: passwordPeriodExpired,
            createdAt: passwordCreated,
            createdBy: userId,
          },
        },
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userChangePassword,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
          },
        },
        sessions: {
          updateMany: {
            where: {
              isRevoked: false,
              expiredAt: {
                gte: passwordCreated,
              },
            },
            data: {
              isRevoked: true,
              revokedAt: passwordCreated,
              revokedById: userId,
            },
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async login(
    userId: string,
    { fingerprint, name, notificationToken, platform }: DeviceRequestDto,
    { loginFrom, loginWith, sessionId, expiredAt, jti }: IUserLogin,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<IUserLoginResult> {
    const today = this.helperService.dateCreate();

    let action: EnumActivityLogAction =
      EnumActivityLogAction.userLoginCredential;
    switch (loginWith) {
      case EnumUserLoginWith.socialApple:
        action = EnumActivityLogAction.userLoginApple;
        break;
      case EnumUserLoginWith.socialGoogle:
        action = EnumActivityLogAction.userLoginGoogle;
        break;
      case EnumUserLoginWith.credential:
      default:
        action = EnumActivityLogAction.userLoginCredential;
        break;
    }

    let notificationProvider: EnumDeviceNotificationProvider | null = null;
    switch (platform) {
      case EnumDevicePlatform.android:
        notificationProvider = EnumDeviceNotificationProvider.fcm;
        break;
      case EnumDevicePlatform.ios:
        notificationProvider = EnumDeviceNotificationProvider.apns;
        break;
      default:
        notificationProvider = null;
        break;
    }

    return this.databaseService.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const device = await tx.device.upsert({
          where: {
            fingerprint,
          },
          update: {
            name,
            platform,
            notificationToken,
            lastActiveAt: today,
            notificationProvider,
            updatedBy: userId,
          },
          create: {
            fingerprint,
            name,
            platform,
            notificationToken,
            lastActiveAt: today,
            notificationProvider,
            createdBy: userId,
          },
        });

        let isNewDevice = false;
        let sessionShouldBeInactive = [];
        let deviceOwnership = await tx.deviceOwnership.findFirst({
          where: {
            deviceId: device.id,
            userId,
            isRevoked: false,
          },
        });
        if (!deviceOwnership) {
          isNewDevice = true;
          deviceOwnership = await tx.deviceOwnership.create({
            data: {
              userId,
              createdBy: userId,
              lastActiveAt: today,
              isRevoked: false,
              deviceId: device.id,
            },
          });
        } else {
          const activeSessions = await tx.session.findMany({
            where: {
              deviceOwnershipId: deviceOwnership.id,
              isRevoked: false,
              expiredAt: { gte: today },
            },
          });

          sessionShouldBeInactive = activeSessions.map(session => ({
            id: session.id,
          }));

          [deviceOwnership] = await Promise.all([
            tx.deviceOwnership.update({
              where: { id: deviceOwnership.id },
              data: {
                lastActiveAt: today,
                updatedBy: userId,
              },
            }),
            tx.session.updateMany({
              where: {
                id: { in: activeSessions.map(s => s.id) },
              },
              data: {
                isRevoked: true,
                revokedAt: today,
              },
            }),
          ]);
        }

        const user = await tx.user.update({
          where: { id: userId, deletedAt: null },
          data: {
            lastLoginAt: today,
            lastIPAddress: ipAddress,
            lastLoginFrom: loginFrom,
            lastLoginWith: loginWith,
            updatedBy: userId,
            activityLogs: {
              create: {
                action,
                ipAddress,
                userAgent: this.databaseUtil.toPlainObject(userAgent),
                geoLocation: this.databaseUtil.toPlainObject(geoLocation),
                createdBy: userId,
              },
            },
            sessions: {
              create: {
                id: sessionId,
                jti,
                expiredAt,
                isRevoked: false,
                ipAddress,
                userAgent: this.databaseUtil.toPlainObject(userAgent),
                geoLocation: this.databaseUtil.toPlainObject(geoLocation),
                createdBy: userId,
              },
            },
          },
        });

        const result: IUserLoginResult = {
          device,
          deviceOwnership,
          isNewDevice,
          user,
          sessionShouldBeInactive,
        };

        return result;
      }
    );
  }

  async createBySocial(
    email: string,
    username: string,
    roleId: string,
    loginWith: EnumUserLoginWith,
    { name, from, cookies }: AuthCreateSocialRequestDto,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const userId = this.databaseUtil.createId();
    const signUpWith =
      loginWith === EnumUserLoginWith.socialApple
        ? EnumUserSignUpWith.socialApple
        : EnumUserSignUpWith.socialGoogle;

    const [user] = await this.databaseService.$transaction([
      this.databaseService.user.create({
        data: {
          id: userId,
          email,
          name,
          roleId,
          signUpFrom: from,
          signUpWith,
          username,
          isVerified: true,
          status: EnumUserStatus.active,
          termPolicy: {
            [Prisma.EnumTermPolicyType.cookies]: cookies,
            [Prisma.EnumTermPolicyType.marketing]: marketing,
            [Prisma.EnumTermPolicyType.privacy]: true,
            [Prisma.EnumTermPolicyType.termsOfService]: true,
          },
          createdBy: userId,
          deletedAt: null,
          activityLogs: {
            create: {
              action: EnumActivityLogAction.userCreated,
              ipAddress,
              userAgent: this.databaseUtil.toPlainObject(userAgent),
              geoLocation: this.databaseUtil.toPlainObject(geoLocation),
              createdBy: userId,
            },
          },
          notificationSettings: {
            createMany: {
              data: Object.values(EnumNotificationChannel)
                .map(channel =>
                  Object.values(EnumNotificationType).map(type => ({
                    channel,
                    type,
                    isActive: true,
                  }))
                )
                .flat(),
            },
          },
        },
        include: {
          role: true,
          twoFactor: true,
        },
      }),
    ]);

    return user;
  }

  async verify(
    userId: string,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        isVerified: true,
        updatedBy: userId,
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userVerifiedEmail,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async createWithNestedRelations(
    userId: string,
    username: string,
    roleId: string,
    { email, name, from }: AuthSignUpRequestDto,
    { passwordHash }: IAuthPassword,
    { expiredAt, reference, hashedToken, type }: IUserVerificationCreate,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const [user] = await this.databaseService.$transaction([
      this.databaseService.user.create({
        data: {
          id: userId,
          email,
          name,
          roleId,
          signUpFrom: from,
          signUpWith: EnumUserSignUpWith.credential,
          username,
          isVerified: false,
          status: EnumUserStatus.active,
          password: passwordHash,
          passwordAttempt: 0,
          createdBy: userId,
          deletedAt: null,
          activityLogs: {
            createMany: {
              data: [
                {
                  action: EnumActivityLogAction.userSignedUp,
                  ipAddress,
                  userAgent: this.databaseUtil.toPlainObject(userAgent),
                  geoLocation: this.databaseUtil.toPlainObject(geoLocation),
                  createdBy: userId,
                },
                {
                  action: EnumActivityLogAction.userSendVerificationEmail,
                  ipAddress,
                  userAgent: this.databaseUtil.toPlainObject(userAgent),
                  geoLocation: this.databaseUtil.toPlainObject(geoLocation),
                  createdBy: userId,
                },
              ],
            },
          },
          notificationSettings: {
            createMany: {
              data: Object.values(EnumNotificationChannel)
                .map(channel =>
                  Object.values(EnumNotificationType).map(type => ({
                    channel,
                    type,
                    isActive: true,
                  }))
                )
                .flat(),
            },
          },
          verifications: {
            create: {
              expiredAt,
              reference,
              token: hashedToken,
              type,
              to: email,
              createdBy: userId,
            },
          },
        },
        include: {
          role: true,
        },
      }),
    ]);

    return user;
  }

  async forgotPassword(
    userId: string,
    email: string,
    { expiredAt, reference, hashedToken }: IUserForgotPasswordCreate,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<void> {
    await this.databaseService.user.update({
      where: {
        id: userId,
        deletedAt: null,
        status: EnumUserStatus.active,
      },
      data: {
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userForgotPassword,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
          },
        },
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
    {
      passwordCreated,
      passwordExpired,
      passwordHash,
      passwordPeriodExpired,
    }: IAuthPassword,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
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
            type: Prisma.EnumPasswordHistoryType.forgot,
            expiredAt: passwordPeriodExpired,
            createdAt: passwordCreated,
            createdBy: userId,
          },
        },
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userResetPassword,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
          },
        },
        forgotPasswords: {
          update: {
            where: { id: forgotPasswordId },
            data: {
              isUsed: true,
              resetAt: passwordCreated,
            },
          },
        },
        sessions: {
          updateMany: {
            where: {
              isRevoked: false,
              expiredAt: {
                gte: passwordCreated,
              },
            },
            data: {
              isRevoked: true,
              revokedAt: passwordCreated,
              revokedById: userId,
            },
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async updateLoginMetadata(
    userId: string,
    { loginFrom, loginWith, sessionId, jti }: IUserLogin,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const today = this.helperService.dateCreate();

    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        lastLoginAt: today,
        lastIPAddress: ipAddress,
        lastLoginFrom: loginFrom,
        lastLoginWith: loginWith,
        updatedBy: userId,
        sessions: {
          update: {
            where: {
              id: sessionId,
            },
            data: {
              jti,
            },
          },
        },
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userRefreshToken,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async reachMaxPasswordAttempt(
    userId: string,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<UserModel> {
    const result = await this.databaseService.user.update({
      where: { id: userId, deletedAt: null },
      data: {
        status: EnumUserStatus.inactive,
        activityLogs: {
          create: {
            action: EnumActivityLogAction.userReachMaxPasswordAttempt,
            ipAddress,
            userAgent: this.databaseUtil.toPlainObject(userAgent),
            geoLocation: this.databaseUtil.toPlainObject(geoLocation),
            createdBy: userId,
          },
        },
      },
    });

    return UserMapper.toDomain(result);
  }

  async importByAdmin(
    data: UserImportRequestDto[],
    usernames: string[],
    passwordHasheds: IAuthPassword[],
    { id: roleId, type: roleType }: IRole,
    { ipAddress, userAgent, geoLocation }: IRequestLog,
    createdBy: string
  ): Promise<UserModel[]> {
    const users = await this.databaseService.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const usersToCreate: Prisma.PrismaPromise<UserModel>[] = [];
        const termPolicyUserAcceptancesToCreate: Prisma.PrismaPromise<Prisma.TermPolicyUserAcceptance>[] =
          [];

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
            tx.user.create({
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
                isVerified: roleType === EnumRoleType.user ? false : true,
                status: EnumUserStatus.active,
                termPolicy: {
                  [Prisma.EnumTermPolicyType.cookies]: false,
                  [Prisma.EnumTermPolicyType.marketing]: false,
                  [Prisma.EnumTermPolicyType.privacy]: true,
                  [Prisma.EnumTermPolicyType.termsOfService]: true,
                },
                createdBy,
                deletedAt: null,
                passwordHistories: {
                  create: {
                    password: passwordHash,
                    type: Prisma.EnumPasswordHistoryType.admin,
                    expiredAt: passwordPeriodExpired,
                    createdAt: passwordCreated,
                    createdBy,
                  },
                },
                activityLogs: {
                  createMany: {
                    data: [
                      {
                        action: EnumActivityLogAction.userCreated,
                        ipAddress,
                        userAgent: this.databaseUtil.toPlainObject(userAgent),
                        geoLocation:
                          this.databaseUtil.toPlainObject(geoLocation),
                        createdBy,
                      },
                      {
                        action: EnumActivityLogAction.userSendVerificationEmail,
                        ipAddress,
                        userAgent: this.databaseUtil.toPlainObject(userAgent),
                        geoLocation:
                          this.databaseUtil.toPlainObject(geoLocation),
                        createdBy,
                      },
                    ],
                  },
                },
                notificationSettings: {
                  createMany: {
                    data: Object.values(EnumNotificationChannel)
                      .map(channel =>
                        Object.values(EnumNotificationType).map(type => ({
                          channel,
                          type,
                          isActive: true,
                        }))
                      )
                      .flat(),
                  },
                },
                twoFactor: {
                  create: {
                    enabled: false,
                    requiredSetup: false,
                    createdBy,
                  },
                },
              },
            })
          );
        }

        const users = await Promise.all(usersToCreate);
        await Promise.all(termPolicyUserAcceptancesToCreate);

        return users;
      }
    );

    return users.map(user => UserMapper.toDomain(user));
  }
}
