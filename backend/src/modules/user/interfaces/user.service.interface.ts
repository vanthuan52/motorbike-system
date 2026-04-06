import { AwsS3PresignDto } from '@/common/aws/dtos/aws.s3-presign.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { IFile } from '@/common/file/interfaces/file.interface';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IUserListFilters } from './user.filter.interface';
import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import { IResponseFileReturn } from '@/common/response/interfaces/response.interface';
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
import {
  IUser,
  IUserForgotPasswordCreate,
  IUserLogin,
  IUserLoginMetadataUpdate,
  IUserLoginResult,
} from '@/modules/user/interfaces/user.interface';
import { UserImportRequestDto } from '@/modules/user/dtos/request/user.import.request.dto';
import { IAuthPassword } from '@/modules/auth/interfaces/auth.interface';
import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '@/modules/user/enums/user.enum';
import { UserModel } from '@/modules/user/models/user.model';
import { Prisma } from '@/generated/prisma-client';
import { ForgotPasswordModel } from '../models/forgot-password.model';

export interface IUserService {
  validateUserGuard(
    request: IRequestApp,
    requiredVerified: boolean
  ): Promise<UserModel>;
  getListOffsetByAdmin(
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >,
    filters?: IUserListFilters
  ): Promise<IPaginationOffsetReturn<UserModel>>;
  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >,
    filters?: IUserListFilters
  ): Promise<IPaginationCursorReturn<UserModel>>;
  getOne(id: string): Promise<UserModel>;
  createByAdmin(
    { email, name, roleId }: UserCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<UserModel>;
  updateStatusByAdmin(
    userId: string,
    { status }: UserUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<UserModel>;
  checkUsername({
    username,
  }: UserCheckUsernameRequestDto): Promise<UserCheckUsernameResponseDto>;
  checkEmail({
    email,
  }: UserCheckEmailRequestDto): Promise<UserCheckEmailResponseDto>;
  getProfile(userId: string): Promise<IUser>;
  updateProfile(
    userId: string,
    data: UserUpdateProfileRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;
  generatePhotoProfilePresign(
    userId: string,
    { extension, size }: UserGeneratePhotoProfileRequestDto
  ): Promise<AwsS3PresignDto>;
  updatePhotoProfile(
    userId: string,
    { photoKey, size }: UserUpdateProfilePhotoRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;
  deleteSelf(userId: string, requestLog: IRequestLog): Promise<void>;
  claimUsername(
    userId: string,
    { username }: UserClaimUsernameRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;
  uploadPhotoProfile(
    userId: string,
    file: IFile,
    requestLog: IRequestLog
  ): Promise<void>;
  updatePasswordByAdmin(
    userId: string,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<UserModel>;
  importByAdmin(
    data: UserImportRequestDto[],
    createdBy: string,
    requestLog: IRequestLog
  ): Promise<void>;
  exportByAdmin(filters?: IUserListFilters): Promise<IResponseFileReturn>;
  // =========================== Service to Service calll ==============================
  createRandomUsername(): string;
  findOneWithRoleByEmail(email: string): Promise<IUser | null>;
  findOneActiveByEmail(email: string): Promise<UserModel | null>;
  createFromSocial(
    email: string,
    username: string,
    roleId: string,
    loginWith: EnumUserLoginWith,
    others: any,
    options?: IDatabaseOptions
  ): Promise<IUser>;
  updateLoginMetadata(
    userId: string,
    data: IUserLoginMetadataUpdate,
    ipAddress: string,
    options?: IDatabaseOptions
  ): Promise<void>;
  createFromRegistration(
    userId: string,
    username: string,
    roleId: string,
    others: any,
    password: IAuthPassword,
    options?: IDatabaseOptions
  ): Promise<IUser>;
  findOneLatestByForgotPassword(
    userId: string
  ): Promise<ForgotPasswordModel | null>;
  createForgotPasswordRequest(
    userId: string,
    email: string,
    passwordReset: IUserForgotPasswordCreate
  ): Promise<void>;

  // =========================== Methods exposed for cross-module service calls ==============================
  updateVerificationStatus(
    userId: string,
    options?: IDatabaseOptions
  ): Promise<UserModel>;
  increasePasswordAttempt(userId: string): Promise<void>;
  resetPasswordAttempt(userId: string): Promise<void>;
  changeUserPassword(
    userId: string,
    password: IAuthPassword,
    options?: IDatabaseOptions
  ): Promise<void>;
  findOneActiveByForgotPasswordToken(token: string): Promise<any | null>;
  resetPassword(
    userId: string,
    forgotPasswordId: string,
    password: IAuthPassword,
    options?: IDatabaseOptions
  ): Promise<void>;
}
