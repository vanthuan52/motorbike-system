import { AwsS3PresignDto } from '@/common/aws/dtos/aws.s3-presign.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IFile } from '@/common/file/interfaces/file.interface';
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
import {
  IResponseFileReturn,
} from '@/common/response/interfaces/response.interface';
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
import { IUser } from '@/modules/user/interfaces/user.interface';
import { UserImportRequestDto } from '@/modules/user/dtos/request/user.import.request.dto';
import { Prisma } from '@/generated/prisma-client';

export interface IUserService {
  validateUserGuard(
    request: IRequestApp,
    requiredVerified: boolean
  ): Promise<IUser>;
  getListOffsetByAdmin(
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>
  ): Promise<IPaginationOffsetReturn<IUser>>;
  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.UserSelect,
      Prisma.UserWhereInput
    >,
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
    country?: Record<string, IPaginationEqual>
  ): Promise<IPaginationCursorReturn<IUser>>;
  getOne(id: string): Promise<IUser>;
  createByAdmin(
    { email, name, roleId }: UserCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<IUser>;
  updateStatusByAdmin(
    userId: string,
    { status }: UserUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IUser>;
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
  ): Promise<IUser>;
  importByAdmin(
    data: UserImportRequestDto[],
    createdBy: string,
    requestLog: IRequestLog
  ): Promise<void>;
  exportByAdmin(
    status?: Record<string, IPaginationIn>,
    role?: Record<string, IPaginationEqual>,
    country?: Record<string, IPaginationEqual>
  ): Promise<IResponseFileReturn>;
}
