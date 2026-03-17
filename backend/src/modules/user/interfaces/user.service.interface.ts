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
import { UserDoc } from '../entities/user.entity';
import { IUserDoc, IUserLogin } from './user.interface';
import { UserCreateRequestDto } from '../dtos/request/user.create.request.dto';
import { UserCreateShadowUserRequestDto } from '../dtos/request/user.create-shadow-user.request.dto';
import { UserCreateBySignUpRequestDto } from '../dtos/request/user.create-by-sign-up.request.dto';
import { UserUpdateRequestDto } from '../dtos/request/user.update.request.dto';
import { UserUpdateStatusRequestDto } from '../dtos/request/user.update-status.request.dto';
import { UserGeneratePhotoProfileRequestDto } from '../dtos/request/user.generate-photo-profile.request.dto';
import { UserCreateSocialRequestDto } from '../dtos/request/user.create-social.request.dto';
import { AwsS3PresignDto } from '@/common/aws/dtos/aws.s3-presign.dto';
import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import { IFile } from '@/common/file/interfaces/file.interface';
import {
  IPaginationEqual,
  IPaginationIn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumUserLoginWith } from '../enums/user.enum';
import { UserUpdateProfileRequestDto } from '../dtos/request/user.update-profile.request.dto';

export interface IUserService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
  ): Promise<{ data: IUserDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
  ): Promise<{ data: IUserDoc[]; total?: number }>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc>;

  findOneWithRole(
    find?: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc>;

  findOneById(id: string, options?: IDatabaseOptions): Promise<UserDoc>;

  findOneWithRoleById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc>;

  findOneByPhone(
    phone: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc>;

  findOneByEmail(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc>;

  existByEmail(
    email: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean>;

  existByPhone(
    phone: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean>;

  create(data: UserCreateRequestDto): Promise<UserDoc>;

  createByAdmin(
    data: UserCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc>;

  createUserByAdmin(
    data: UserCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc>;

  createShadowUser(
    data: UserCreateShadowUserRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc>;

  createBySignUp(
    data: UserCreateBySignUpRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc>;

  createBySocial(
    email: string,
    roleId: string,
    loginWith: EnumUserLoginWith,
    socialData: UserCreateSocialRequestDto,
    requestLog: IRequestLog,
    options?: IDatabaseCreateOptions,
  ): Promise<IUserDoc>;

  findOrCreateUserBySocial(
    email: string,
    loginWith: EnumUserLoginWith,
    socialData: UserCreateSocialRequestDto,
    requestLog: IRequestLog,
  ): Promise<IUserDoc>;

  update(
    id: string,
    data: UserUpdateRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  updateProfile(
    id: string,
    data: UserUpdateProfileRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  updateStatus(
    id: string,
    data: UserUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updatePassword(
    id: string,
    newPassword: string,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateVerify(
    id: string,
    isVerified: boolean,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseDeleteOptions): Promise<void>;

  softDelete(id: string, options?: IDatabaseSoftDeleteOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<void>;

  generatePhotoProfilePresign(
    id: string,
    data: UserGeneratePhotoProfileRequestDto,
  ): Promise<AwsS3PresignDto>;

  confirmPhotoProfile(id: string, key: string): Promise<void>;

  uploadPhotoProfile(
    id: string,
    file: IFile,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  updateLogin(
    id: string,
    { loginFrom, loginWith, sessionId, expiredAt, jti }: IUserLogin,
    { ipAddress, userAgent }: IRequestLog,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  validateUserGuard(
    request: IRequestApp,
    requiredVerified: boolean,
  ): Promise<UserDoc>;

  incrementUserPasswordAttempt(id: string): Promise<void>;
  resetUserPasswordAttempt(id: string): Promise<void>;
}
