import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.enum';
import { AwsS3PresignDto } from '@/common/aws/dtos/aws.s3-presign.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { AwsS3Service } from '@/common/aws/services/aws.s3.service';
import {
  EnumFileExtensionDocument,
  EnumFileExtensionImage,
} from '@/common/file/enums/file.enum';
import { IFile } from '@/common/file/interfaces/file.interface';
import { FileService } from '@/common/file/services/file.service';
import { HelperService } from '@/common/helper/services/helper.service';
import {
  IPaginationEqual,
  IPaginationIn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import { IResponseFileReturn } from '@/common/response/interfaces/response.interface';
import { EnumAuthStatusCodeError } from '@/modules/auth/enums/auth.status-code.enum';
import { IAuthPassword } from '@/modules/auth/interfaces/auth.interface';
import { AuthUtil } from '@/modules/auth/utils/auth.util';
import { EnumRoleStatusCodeError } from '@/modules/role/enums/role.status-code.enum';
import { RoleRepository } from '@/modules/role/repositories/role.repository';
import { SessionRepository } from '@/modules/session/repositories/session.repository';
import { SessionUtil } from '@/modules/session/utils/session.util';
import {
  UserCheckEmailRequestDto,
  UserCheckUsernameRequestDto,
} from '@/modules/user/dtos/request/user.check.request.dto';
import { UserClaimUsernameRequestDto } from '@/modules/user/dtos/request/user.claim-username.request.dto';
import { UserCreateRequestDto } from '@/modules/user/dtos/request/user.create.request.dto';
import { UserGeneratePhotoProfileRequestDto } from '@/modules/user/dtos/request/user.generate-photo-profile.request.dto';
import {
  UserUpdateProfilePhotoRequestDto,
  UserUpdateProfileRequestDto,
} from '@/modules/user/dtos/request/user.profile.request.dto';
import { UserUpdateStatusRequestDto } from '@/modules/user/dtos/request/user.update-status.request.dto';
import {
  UserCheckEmailResponseDto,
  UserCheckUsernameResponseDto,
} from '@/modules/user/dtos/response/user.check.response.dto';
import { EnumUserStatusCodeError } from '@/modules/user/enums/user.status-code.enum';
import {
  IUser,
  IUserForgotPasswordCreate,
  IUserLogin,
  IUserLoginResult,
} from '@/modules/user/interfaces/user.interface';
import { IUserService } from '@/modules/user/interfaces/user.service.interface';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserUtil } from '@/modules/user/utils/user.util';
import { UserModel } from '@/modules/user/models/user.model';
import { UserImportRequestDto } from '@/modules/user/dtos/request/user.import.request.dto';
import { NotificationUtil } from '@/modules/notification/utils/notification.util';
import { EnumAwsStatusCodeError } from '@/common/aws/enums/aws.status-code.enum';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { EnumUserLoginWith, EnumUserStatus } from '../enums/user.enum';
import { Prisma } from '@/generated/prisma-client';
import { IUserVerificationCreate } from '@/modules/verification/interfaces/verification.interface';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  private readonly userRoleName: string;

  constructor(
    private readonly userUtil: UserUtil,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly helperService: HelperService,
    private readonly fileService: FileService,
    private readonly notificationUtil: NotificationUtil,
    private readonly authUtil: AuthUtil,
    private readonly sessionUtil: SessionUtil,
    private readonly sessionRepository: SessionRepository,
    private readonly configService: ConfigService,
    private readonly databaseUtil: DatabaseUtil
  ) {
    this.userRoleName = this.configService.get<string>('user.default.role');
  }

  async validateUserGuard(
    request: IRequestApp,
    requiredVerified: boolean
  ): Promise<IUser> {
    if (!request.user) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.jwtAccessTokenInvalid,
        message: 'auth.error.accessTokenUnauthorized',
      });
    }

    const { userId } = request.user;
    const user = await this.userRepository.findOneWithRoleById(userId);
    if (!user) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    } else if (user.status === EnumUserStatus.blocked) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.blockedForbidden,
        message: 'user.error.blocked',
      });
    } else if (user.status !== EnumUserStatus.active) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.inactiveForbidden,
        message: 'user.error.inactive',
      });
    } else if (requiredVerified === true && user.isVerified !== true) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.emailNotVerified,
        message: 'user.error.emailNotVerified',
      });
    }

    return user;
  }

  async getListOffsetByAdmin(
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>
  ): Promise<IPaginationOffsetReturn<IUser>> {
    return this.userRepository.findWithPaginationOffset(
      pagination,
      status,
      role
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
    country?: Record<string, IPaginationEqual>
  ): Promise<IPaginationCursorReturn<IUser>> {
    return this.userRepository.findWithPaginationCursor(
      pagination,
      status,
      role,
      country
    );
  }

  async getOne(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneProfileById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async createByAdmin(
    { email, name, roleId }: UserCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<IUser> {
    const [checkRole, emailExist] = await Promise.all([
      this.roleRepository.existById(roleId),
      this.userRepository.existByEmail(email),
    ]);

    if (!checkRole) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    } else if (emailExist) {
      throw new ConflictException({
        statusCode: EnumUserStatusCodeError.emailExist,
        message: 'user.error.emailExist',
      });
    }

    try {
      const userId = this.databaseUtil.createId();
      const passwordString = this.authUtil.createPasswordRandom();
      const password: IAuthPassword = this.authUtil.createPassword(
        userId,
        passwordString,
        {
          temporary: true,
        }
      );
      const randomUsername = this.userUtil.createRandomUsername();
      const created = await this.userRepository.createByAdmin(
        userId,
        randomUsername,
        {
          email,
          name,
          roleId,
        },
        password,
        checkRole,
        requestLog,
        createdBy
      );

      // @note: send email after all creation
      await this.notificationUtil.sendWelcomeByAdmin(
        created.id,
        {
          password: password.passwordEncrypted,
          passwordCreatedAt: this.helperService.dateFormatToIso(
            password.passwordCreated
          ),
          passwordExpiredAt: this.helperService.dateFormatToIso(
            password.passwordExpired
          ),
        },
        createdBy
      );

      return created;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async updateStatusByAdmin(
    userId: string,
    { status }: UserUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IUser> {
    if (userId === updatedBy) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.notSelf,
        message: 'user.error.notSelf',
      });
    }

    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    } else if (user.status === EnumUserStatus.blocked) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.blockedInvalid,
        message: 'user.error.blockedInvalid',
      });
    }

    try {
      return await this.userRepository.updateStatusByAdmin(
        userId,
        { status },
        requestLog,
        updatedBy
      );
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async checkUsername({
    username,
  }: UserCheckUsernameRequestDto): Promise<UserCheckUsernameResponseDto> {
    const [checkUsername, checkBadWord, isExist] = await Promise.all([
      this.userUtil.checkUsernamePattern(username),
      this.userUtil.checkBadWord(username),
      this.userRepository.existByUsername(username),
    ]);

    return {
      badWord: checkBadWord,
      exist: !!isExist,
      pattern: checkUsername,
    };
  }

  async checkEmail({
    email,
  }: UserCheckEmailRequestDto): Promise<UserCheckEmailResponseDto> {
    const [checkBadWord, isExist] = await Promise.all([
      this.userUtil.checkBadWord(email),
      this.userRepository.existByEmail(email),
    ]);

    return {
      badWord: checkBadWord,
      exist: !!isExist,
    };
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await this.userRepository.findOneActiveProfileById(userId);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async updateProfile(
    userId: string,
    { ...data }: UserUpdateProfileRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    try {
      await this.userRepository.updateProfile(
        userId,
        {
          ...data,
        },
        requestLog
      );
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async generatePhotoProfilePresign(
    userId: string,
    { extension, size }: UserGeneratePhotoProfileRequestDto
  ): Promise<AwsS3PresignDto> {
    const key: string = this.userUtil.createRandomFilenamePhotoProfileWithPath(
      userId,
      {
        extension,
      }
    );

    const aws: AwsS3PresignDto | null = await this.awsS3Service.presignPutItem(
      {
        key,
        size,
      },
      {
        forceUpdate: true,
      }
    );

    if (!aws) {
      throw new ServiceUnavailableException({
        statusCode: EnumAwsStatusCodeError.serviceUnavailable,
        message: 'aws.error.serviceUnavailable',
      });
    }

    return aws;
  }

  async updatePhotoProfile(
    userId: string,
    { photoKey, size }: UserUpdateProfilePhotoRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    try {
      const aws: AwsS3Dto = this.awsS3Service.mapPresign({
        key: photoKey,
        size,
      });

      await this.userRepository.updatePhotoProfile(userId, aws, requestLog);
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async deleteSelf(userId: string, requestLog: IRequestLog): Promise<void> {
    try {
      const sessions = await this.sessionRepository.findActive(userId);
      await Promise.all([
        this.userRepository.deleteSelf(userId, requestLog),
        this.sessionUtil.deleteAllLogins(userId, sessions),
      ]);
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async claimUsername(
    userId: string,
    { username }: UserClaimUsernameRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    const [checkUsername, checkBadWord, exist] = await Promise.all([
      this.userUtil.checkUsernamePattern(username),
      this.userUtil.checkBadWord(username),
      this.userRepository.existByUsername(username),
    ]);
    if (checkUsername) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.usernameNotAllowed,
        message: 'user.error.usernameNotAllowed',
      });
    } else if (checkBadWord) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.usernameContainBadWord,
        message: 'user.error.usernameContainBadWord',
      });
    } else if (exist) {
      throw new ConflictException({
        statusCode: EnumUserStatusCodeError.usernameExist,
        message: 'user.error.usernameExist',
      });
    }

    try {
      await this.userRepository.claimUsername(userId, { username }, requestLog);
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async uploadPhotoProfile(
    userId: string,
    file: IFile,
    requestLog: IRequestLog
  ): Promise<void> {
    try {
      const extension: EnumFileExtensionImage =
        this.fileService.extractExtensionFromFilename(
          file.originalname
        ) as EnumFileExtensionImage;

      const key: string =
        this.userUtil.createRandomFilenamePhotoProfileWithPath(userId, {
          extension,
        });

      const aws: AwsS3Dto | null = await this.awsS3Service.putItem({
        key,
        size: file.size,
        file: file.buffer,
      });

      if (aws) {
        this.logger.debug(
          {
            userId,
            fileSize: file.size,
            awsKey: aws.key,
            awsBucket: aws.bucket,
          },
          `Photo profile uploaded to S3 with key: ${key}`
        );

        await this.userRepository.updatePhotoProfile(userId, aws, requestLog);
      }
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async updatePasswordByAdmin(
    userId: string,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IUser> {
    if (userId === updatedBy) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.notSelf,
        message: 'user.error.notSelf',
      });
    }

    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    } else if (user.status === EnumUserStatus.blocked) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.blockedInvalid,
        message: 'user.error.blockedInvalid',
      });
    }

    try {
      const passwordString = this.authUtil.createPasswordRandom();
      const password = this.authUtil.createPassword(userId, passwordString, {
        temporary: true,
      });

      const sessions = await this.sessionRepository.findActive(userId);
      const [updated] = await Promise.all([
        this.userRepository.updatePasswordByAdmin(
          userId,
          password,
          requestLog,
          updatedBy
        ),
        this.sessionUtil.deleteAllLogins(userId, sessions),
      ]);

      // @note: send email after all creation
      await this.notificationUtil.sendTemporaryPasswordByAdmin(
        updated.id,
        {
          password: password.passwordEncrypted,
          passwordCreatedAt: this.helperService.dateFormatToIso(
            password.passwordCreated
          ),
          passwordExpiredAt: this.helperService.dateFormatToIso(
            password.passwordExpired
          ),
        },
        updatedBy
      );

      return updated;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async importByAdmin(
    data: UserImportRequestDto[],
    createdBy: string,
    requestLog: IRequestLog
  ): Promise<void> {
    const emails = data.map(item => item.email);
    const [checkRole, existingUsers] = await Promise.all([
      this.roleRepository.existByName(this.userRoleName),
      this.userRepository.findByEmails(emails),
    ]);

    if (existingUsers.length > 0) {
      throw new ConflictException({
        statusCode: EnumUserStatusCodeError.emailExist,
        message: 'user.error.importEmailExist',
        messageProperties: {
          emails: existingUsers.map(user => user.email).join(', '),
        },
      });
    } else if (!checkRole) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    try {
      const totalData = data.length;
      const userIds = Array(totalData)
        .fill(0)
        .map(() => this.databaseUtil.createId());
      const usernames = Array(totalData)
        .fill(0)
        .map(() => this.userUtil.createRandomUsername());
      const passwords = Array(totalData)
        .fill(0)
        .map(() => this.authUtil.createPasswordRandom());
      const passwordHasheds = userIds.map((e, i) =>
        this.authUtil.createPassword(e, passwords[i])
      );

      const newUsers = await this.userRepository.importByAdmin(
        data,
        usernames,
        passwordHasheds,
        checkRole,
        requestLog,
        createdBy
      );

      // @note: send email after all creation
      const sendEmailPromises = [];
      for (const [index, newUser] of newUsers.entries()) {
        sendEmailPromises.push(
          this.notificationUtil.sendWelcomeByAdmin(
            newUser.id,
            {
              password: passwordHasheds[index].passwordEncrypted,
              passwordCreatedAt: this.helperService.dateFormatToIso(
                passwordHasheds[index].passwordCreated
              ),
              passwordExpiredAt: this.helperService.dateFormatToIso(
                passwordHasheds[index].passwordExpired
              ),
            },
            createdBy
          )
        );
      }

      await Promise.all(sendEmailPromises);
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async exportByAdmin(
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
    country?: Record<string, IPaginationEqual>
  ): Promise<IResponseFileReturn> {
    const data = await this.userRepository.findExport(status, role, country);

    const users = this.userUtil.mapExport(data);
    const csvString = this.fileService.writeCsv(users);

    return {
      data: csvString,
      extension: EnumFileExtensionDocument.csv,
    };
  }

  // =========================== Service to Service calll ==============================
  createRandomUsername(): string {
    return this.userUtil.createRandomUsername();
  }

  async findOneWithRoleByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findOneWithRoleByEmail(email);
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async createBySocial(
    email: string,
    username: string,
    roleId: string,
    loginWith: EnumUserLoginWith,
    { from, device, ...others },
    requestLog: IRequestLog
  ): Promise<IUser> {
    return this.userRepository.createBySocial(
      email,
      username,
      roleId,
      loginWith,
      { from, device, ...others },
      requestLog
    );
  }

  async updateLoginMetadata(
    userId: string,
    data: IUserLogin,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<void> {
    await this.userRepository.updateLoginMetadata(userId, data, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  async createFromRegistration(
    userId: string,
    username: string,
    roleId: string,
    { from, device, ...others }: any,
    password: IAuthPassword,
    emailVerification: IUserVerificationCreate,
    requestLog: IRequestLog
  ): Promise<IUser> {
    return this.userRepository.createWithNestedRelations(
      userId,
      username,
      roleId,

      { from, device, ...others },
      password,
      emailVerification,
      requestLog
    );
  }

  async findOneActiveByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findOneActiveByEmail(email);
  }

  async findOneLatestByForgotPassword(userId: string): Promise<IUser | null> {
    return this.userRepository.findOneLatestByForgotPassword(userId);
  }

  async forgotPassword(
    userId: string,
    email: string,
    passwordReset: IUserForgotPasswordCreate,
    requestLog: IRequestLog
  ): Promise<void> {
    await this.userRepository.forgotPassword(
      userId,
      email,
      passwordReset,
      requestLog
    );
  }

  async resetPassword(
    userId: string,
    { password, passwordExpired }: IAuthPassword,
    requestLog: IRequestLog
  ): Promise<void> {
    await this.userRepository.resetPassword(
      userId,
      { password, passwordExpired },
      requestLog
    );
  }

  // =========================== Methods exposed for cross-module service calls ==============================

  /**
   * Mark a user as verified. Called by VerificationService after email-verification flow.
   */
  async markVerified(
    userId: string,
    requestLog: IRequestLog
  ): Promise<UserModel> {
    return this.userRepository.verify(userId, requestLog);
  }

  async increasePasswordAttempt(userId: string): Promise<void> {
    await this.userRepository.increasePasswordAttempt(userId);
  }

  async resetPasswordAttempt(userId: string): Promise<void> {
    await this.userRepository.resetPasswordAttempt(userId);
  }

  async changeUserPassword(
    userId: string,
    password: IAuthPassword,
    requestLog: IRequestLog
  ): Promise<void> {
    await this.userRepository.changePassword(userId, password, requestLog);
  }

  async loginUser(
    userId: string,
    device: any,
    loginData: IUserLogin,
    requestLog: IRequestLog
  ): Promise<IUserLoginResult> {
    return this.userRepository.login(userId, device, loginData, requestLog);
  }

  async findOneActiveByForgotPasswordToken(token: string): Promise<any | null> {
    return this.userRepository.findOneActiveByForgotPasswordToken(token);
  }

  async resetPasswordWithToken(
    userId: string,
    forgotPasswordId: string,
    password: IAuthPassword,
    requestLog: IRequestLog
  ): Promise<void> {
    await this.userRepository.resetPassword(
      userId,
      forgotPasswordId,
      password,
      requestLog
    );
  }
}
