import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserService } from '../interfaces/user.service.interface';
import { UserRepository } from '../repository/user.repository';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { UserDoc, UserEntity } from '../entities/user.entity';
import { DatabaseHelperQueryContain } from '@/common/database/decorators/database.decorator';
import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserStatus,
} from '../enums/user.enum';
import { IUserDoc, IUserLogin } from '../interfaces/user.interface';
import { IAuthPassword } from '@/modules/auth/interfaces/auth.interface';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { UserUpdateStatusRequestDto } from '../dtos/request/user.update-status.request.dto';
import { UserUpdateRequestDto } from '../dtos/request/user.update.request.dto';
import { UserCreateBySignUpRequestDto } from '../dtos/request/user.create-by-sign-up.request.dto';
import { UserCreateRequestDto } from '../dtos/request/user.create.request.dto';
import { AwsS3PresignDto } from '@/common/aws/dtos/aws.s3-presign.dto';
import { AwsS3Service } from '@/common/aws/services/aws.s3.service';
import { UserUtil } from '../utils/user.util';
import { UserGeneratePhotoProfileRequestDto } from '../dtos/request/user.generate-photo-profile.request.dto';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.enum';
import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import { IFile } from '@/common/file/interfaces/file.interface';
import { EnumFileExtensionImage } from '@/common/file/enums/file.enum';
import { FileService } from '@/common/file/services/file.service';
import { MediaService } from '@/modules/media/services/media.service';
import { EnumMediaPurpose } from '@/modules/media/enums/media.enum';
import { EnumUserStatusCodeError } from '../enums/user.status-code.enum';
import { AuthUtil } from '@/modules/auth/utils/auth.util';
import { EnumRoleStatusCodeError } from '@/modules/role/enums/role.status-code.enum';
import { RoleService } from '@/modules/role/services/role.service';
import { UserCreateSocialRequestDto } from '../dtos/request/user.create-social.request.dto';

import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
  IPaginationEqual,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumRoleType } from '@/modules/policy/enums/policy.enum';
import { UserUpdateProfileRequestDto } from '../dtos/request/user.update-profile.request.dto';
import { EnumAuthStatusCodeError } from '@/modules/auth/enums/auth.status-code.enum';
import { UserCreateShadowUserRequestDto } from '../dtos/request/user.create-shadow-user.request.dto';

@Injectable()
export class UserService implements IUserService {
  private readonly userRoleName: string = EnumRoleType.user.toString();

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly mediaService: MediaService,
    private readonly userUtil: UserUtil,
    private readonly authUtil: AuthUtil,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
  ): Promise<{ data: IUserDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...status,
      ...role,
    };

    const [data, total] = await Promise.all([
      this.userRepository.findAll<IUserDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: {
          path: 'role',
        },
      }),
      this.userRepository.getTotal(find),
    ]);

    return { data, total };
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
  ): Promise<{ data: IUserDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...status, ...role };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, total] = await Promise.all([
      this.userRepository.findAllCursor<IUserDoc>(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
        join: {
          path: 'role',
        },
      }),
      includeCount
        ? this.userRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data.slice(0, limit);

    return { data: items, total };
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc> {
    const user = await this.userRepository.findOne<UserDoc>(find, options);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async findOneWithRole(
    find?: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc> {
    const actualFind = find ?? {};

    const user: IUserDoc = await this.userRepository.findOne<IUserDoc>(
      actualFind,
      {
        ...options,
        join: true,
      },
    );

    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async findOneById(_id: string, options?: IDatabaseOptions): Promise<UserDoc> {
    const user: UserDoc = await this.userRepository.findOneById<UserDoc>(
      _id,
      options,
    );

    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async findOneWithRoleById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc> {
    const user: IUserDoc = await this.userRepository.findOneWithRoleById(_id, {
      ...options,
      join: true,
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async findOneByPhone(
    phone: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc> {
    const user: UserDoc = await this.userRepository.findOne<UserDoc>(
      {
        phone,
      },
      options,
    );

    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async findOneByEmail(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc> {
    const user: UserDoc = await this.userRepository.findOne<UserDoc>(
      DatabaseHelperQueryContain('email', email, { fullWord: true }),
      options,
    );

    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async existByEmail(
    email: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const exist = await this.userRepository.exists(
      DatabaseHelperQueryContain('email', email, { fullWord: true }),
      options,
    );

    return exist;
  }

  async existByPhone(
    phone: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const exist = await this.userRepository.exists(
      DatabaseHelperQueryContain('phone', phone, { fullWord: true }),
      options,
    );

    return exist;
  }

  async create(
    data: UserCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    const create: UserEntity = new UserEntity();
    create.name = data.name;
    create.email = data.email;
    create.role = data.role;
    create.phone = data.phone;
    create.gender = data.gender;
    create.status = data.status;
    create.isVerified = data.isVerified;
    create.password = data.password;
    create.signUpFrom = data.signUpFrom;
    create.signUpWith = data.signUpWith;
    create.signUpDate = new Date();

    const created = await this.userRepository.create<UserEntity>(
      create,
      options,
    );

    return created;
  }

  async createByAdmin(
    data: UserCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    // Create password
    const [role, emailExist] = await Promise.all([
      this.roleService.findOneById(data.role),
      this.existByEmail(data.email),
    ]);

    // Validate role exists
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    // Validate email not taken
    if (emailExist) {
      throw new ConflictException({
        statusCode: EnumUserStatusCodeError.emailExist,
        message: 'user.error.emailExist',
      });
    }

    // Create password
    const passwordString = this.userUtil.createDefaultPassword();
    const password: IAuthPassword = this.authUtil.createPassword(
      passwordString,
      { temporary: true },
    );

    const dataToCreate: UserCreateRequestDto = {
      name: data.name,
      email: data.email,
      role: role._id,
      phone: data.phone,
      gender: data.gender,
      status: data.status,
      isVerified: true,
      password: password.passwordHash,
      signUpFrom: EnumUserSignUpFrom.admin,
      signUpWith: EnumUserSignUpWith.credential,
      signUpDate: new Date(),
    };

    return this.create(dataToCreate, options);
  }

  async createUserByAdmin(
    data: UserCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    // Create password
    const [role, emailExist] = await Promise.all([
      this.roleService.findOneByName(this.userRoleName),
      this.existByEmail(data.email),
    ]);

    // Validate role exists
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    // Validate email not taken
    if (emailExist) {
      throw new ConflictException({
        statusCode: EnumUserStatusCodeError.emailExist,
        message: 'user.error.emailExist',
      });
    }

    // Create password
    const passwordString = this.userUtil.createDefaultPassword();
    const password: IAuthPassword = this.authUtil.createPassword(
      passwordString,
      { temporary: true },
    );

    const dataToCreate: UserCreateRequestDto = {
      name: data.name,
      email: data.email,
      role: role._id,
      phone: data.phone,
      gender: data.gender,
      status: data.status,
      isVerified: true,
      password: password.passwordHash,
      signUpFrom: EnumUserSignUpFrom.admin,
      signUpWith: EnumUserSignUpWith.credential,
      signUpDate: new Date(),
    };

    return this.create(dataToCreate, options);
  }

  async createShadowUser(
    { name, phone }: UserCreateShadowUserRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    const [role, phoneExist] = await Promise.all([
      this.roleService.findOneByName(this.userRoleName),
      this.existByPhone(phone),
    ]);

    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }
    if (phoneExist) {
      throw new ConflictException({
        statusCode: EnumUserStatusCodeError.mobileNumberExist,
        message: 'user.error.phoneExist',
      });
    }

    const passwordString = this.userUtil.createDefaultPassword();
    const password = this.authUtil.createPassword(passwordString);

    const dataToCreate: UserCreateRequestDto = {
      name,
      email: this.userUtil.createTempEmail(phone),
      role: role._id,
      phone,
      status: EnumUserStatus.active,
      password: password.passwordHash,
      signUpFrom: EnumUserSignUpFrom.system,
      signUpWith: EnumUserSignUpWith.credential,
      signUpDate: new Date(),
    };

    return this.create(dataToCreate, options);
  }

  async createBySignUp(
    data: UserCreateBySignUpRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    const dataToCreate: UserCreateRequestDto = {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      password: data.passwordHash,
      role: data.roleId,
      status: EnumUserStatus.active,
      isVerified: false,
      signUpFrom: data.signUpFrom,
      signUpWith: data.signUpWith,
      signUpDate: new Date(),
    };

    return this.create(dataToCreate, options);
  }

  async update(
    id: string,
    data: UserUpdateRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    if (data.name) user.name = data.name;
    if (data.phone) user.phone = data.phone;
    if (data.role) user.role = data.role;
    if (data.status) user.status = data.status;
    if (data.gender) user.gender = data.gender;

    await this.userRepository.save(user, options);
  }

  async updateProfile(
    id: string,
    { name, phone, gender }: UserUpdateProfileRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    user.name = name;
    user.phone = phone;
    user.gender = gender;

    await this.userRepository.save(user, options);
  }

  async updateStatus(
    id: string,
    { status }: UserUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    user.status = status;
    await this.userRepository.save(user, options);
  }

  /**
   * Mark user email as verified or unverified
   * @param id User ID
   * @param options Database options
   */
  async updateVerify(
    id: string,
    isVerified: boolean,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    await this.userRepository.updateRaw(
      { _id: id },
      {
        $set: {
          isVerified: isVerified,
          verifiedAt: isVerified ? new Date() : undefined,
          updatedBy: id,
        },
      },
      options,
    );
  }

  async updatePassword(
    id: string,
    newPassword: string,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    if (user.status === EnumUserStatus.blocked) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.statusInvalid,
        message: 'user.error.statusInvalid',
        messageProperties: {
          status: user.status.toLowerCase(),
        },
      });
    }

    const { passwordHash } = this.authUtil.createPassword(newPassword, {
      temporary: true,
    });

    user.password = passwordHash;

    await this.userRepository.save(user, {
      ...options,
    } as IDatabaseSaveOptions);
  }

  async generatePhotoProfilePresign(
    id: string,
    { extension, size }: UserGeneratePhotoProfileRequestDto,
  ): Promise<AwsS3PresignDto> {
    const key: string = this.userUtil.createRandomFilenamePhotoProfileWithPath(
      id,
      {
        extension,
      },
    );

    const aws: AwsS3PresignDto = await this.awsS3Service.presignPutItem(
      {
        key,
        size,
      },
      {
        forceUpdate: true,
      },
    );

    return aws;
  }

  /**
   * Confirm photo profile upload after client uploads via presigned URL
   * @param id User ID
   * @param key S3 object key returned from presign endpoint
   * @returns Updated user profile response
   */
  async confirmPhotoProfile(id: string, key: string): Promise<void> {
    try {
      // 1. Get user
      const user = await this.userRepository.findOneById(id);
      if (!user) {
        throw new NotFoundException({
          statusCode: EnumUserStatusCodeError.notFound,
          message: 'user.error.notFound',
        });
      }

      // 2. Verify file exists in S3
      const s3Data: AwsS3Dto = await this.awsS3Service.checkItem(key);

      // 3. Extract filename from key
      const filename = key.split('/').pop() || 'photo';

      // 4. Create media record
      const media = await this.mediaService.createFromS3(
        s3Data,
        filename,
        EnumMediaPurpose.ProfilePhoto,
        id,
        'user',
      );

      // 5. Activate media
      await this.mediaService.activate(media);

      // 6. Update user.photo with embedded media data
      user.photo = this.mediaService.mapToEmbedded(media);
      await this.userRepository.save(user);

      return;
    } catch (err: unknown) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async uploadPhotoProfile(
    id: string,
    file: IFile,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const extension: EnumFileExtensionImage =
      this.fileService.extractExtensionFromFilename(
        file.originalname,
      ) as EnumFileExtensionImage;

    const key: string = this.userUtil.createRandomFilenamePhotoProfileWithPath(
      id,
      {
        extension,
      },
    );

    const aws: AwsS3Dto = await this.awsS3Service.putItem({
      key,
      size: file.size,
      file: file.buffer,
    });

    // Create media record and update user
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    const filename = key.split('/').pop() || 'photo';
    const media = await this.mediaService.createFromS3(
      aws,
      filename,
      EnumMediaPurpose.ProfilePhoto,
      id,
      'user',
    );
    await this.mediaService.activate(media);

    user.photo = this.mediaService.mapToEmbedded(media);
    await this.userRepository.save(user, options);

    return;
  }

  async delete(id: string, options?: IDatabaseDeleteOptions): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    await this.userRepository.delete({ _id: id }, options);
  }

  async softDelete(
    id: string,
    options?: IDatabaseSoftDeleteOptions,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    await this.userRepository.softDelete(user, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<void> {
    await this.userRepository.deleteMany(find, options);
  }

  /**
   * Update user login information
   * @param id User ID
   * @param loginData Login session data
   * @param requestLog Request logging info
   * @param options Database options
   */
  async updateLogin(
    id: string,
    { loginFrom, loginWith, sessionId, expiredAt, jti }: IUserLogin,
    { ipAddress, userAgent }: IRequestLog,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    await this.userRepository.updateRaw(
      { _id: id },
      {
        $set: {
          lastLoginAt: new Date(),
          lastIPAddress: ipAddress,
          lastLoginFrom: loginFrom,
          lastLoginWith: loginWith,
          updatedBy: id,
        },
      },
      options,
    );
  }

  /**
   * Create user via social login (Google/Apple)
   * @param email User email from social provider
   * @param roleId Role ID to assign
   * @param loginWith Social login method (google/apple)
   * @param socialData Social registration data
   * @param requestLog Request logging info
   * @param options Database options
   */
  async createBySocial(
    email: string,
    roleId: string,
    loginWith: EnumUserLoginWith,
    { name, from }: UserCreateSocialRequestDto,
    { ipAddress, userAgent }: IRequestLog,
    options?: IDatabaseCreateOptions,
  ): Promise<IUserDoc> {
    const signUpWith =
      loginWith === EnumUserLoginWith.apple
        ? EnumUserSignUpWith.apple
        : EnumUserSignUpWith.google;

    // Map login from to sign up from
    const signUpFrom =
      from === EnumUserLoginFrom.mobile
        ? EnumUserSignUpFrom.mobile
        : EnumUserSignUpFrom.website;

    const create: UserEntity = new UserEntity();
    create.email = email.toLowerCase();
    create.name = name;
    create.role = roleId;
    create.signUpFrom = signUpFrom;
    create.signUpWith = signUpWith;
    create.signUpDate = new Date();
    create.isVerified = true;
    create.verifiedAt = new Date();
    create.status = EnumUserStatus.active;
    create.lastLoginAt = new Date();
    create.lastIPAddress = ipAddress;
    create.lastLoginFrom = from;
    create.lastLoginWith = loginWith;

    const user = await this.userRepository.create<UserEntity>(create, options);

    return this.userRepository.join(user, this.userRepository._join!);
  }

  /**
   * Increment user password attempt counter
   * @param id User ID
   */
  async incrementUserPasswordAttempt(id: string): Promise<void> {
    await this.userRepository.incrementPasswordAttempt(id);
  }

  /**
   * Reset user password attempt counter
   * @param id User ID
   */
  async resetUserPasswordAttempt(id: string): Promise<void> {
    await this.userRepository.resetPasswordAttempt(id);
  }

  /**
   * Find existing user or create new one via social login
   * @param email User's email from social provider
   * @param loginWith Social login method (google/apple)
   * @param socialData Social registration data
   * @param requestLog Request logging info
   * @returns User document with role populated
   */
  async findOrCreateUserBySocial(
    email: string,
    loginWith: EnumUserLoginWith,
    { from, ...others }: UserCreateSocialRequestDto,
    requestLog: IRequestLog,
  ): Promise<IUserDoc> {
    let user = await this.userRepository.findOneWithRole({ email });

    if (!user) {
      const role = await this.roleService.findOneByName(this.userRoleName);
      if (!role) {
        throw new NotFoundException({
          statusCode: EnumRoleStatusCodeError.notFound,
          message: 'role.error.notFound',
        });
      }

      user = await this.createBySocial(
        email,
        role._id,
        loginWith,
        { from, ...others },
        requestLog,
      );
    }

    return user;
  }

  /**
   * Validates user for protected routes guard.
   *
   * Verifies request contains user info, fetches user with role from database,
   * and validates password expiration and email verification status.
   *
   * @param request - The HTTP request object containing user info from JWT
   * @param requiredVerified - Whether email verification is required
   * @returns Promise resolving to the user document if validation succeeds
   * @throws {UnauthorizedException} When request has no user info
   * @throws {ForbiddenException} When user not found, inactive, password expired, or email not verified
   */
  async validateUserGuard(
    request: IRequestApp,
    requiredVerified: boolean,
  ): Promise<UserDoc> {
    if (!request.user) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.jwtAccessTokenInvalid,
        message: 'auth.error.accessTokenUnauthorized',
      });
    }

    const { userId } = request.user;
    const user: UserDoc = await this.userRepository.findOneById(userId);

    const checkPasswordExpired: boolean = this.authUtil.checkPasswordExpired(
      user.passwordExpired,
    );
    if (checkPasswordExpired) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.passwordExpired,
        message: 'auth.error.passwordExpired',
      });
    } else if (requiredVerified === true && user.isVerified !== true) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.emailNotVerified,
        message: 'user.error.emailNotVerified',
      });
    }

    return user;
  }

  async incrementPasswordAttempt(_id: string): Promise<void> {
    await this.userRepository.incrementPasswordAttempt(_id);
  }

  async resetPasswordAttempt(_id: string): Promise<void> {
    await this.userRepository.resetPasswordAttempt(_id);
  }
}
