import { PipelineStage } from 'mongoose';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { UserDoc, UserEntity } from '../entities/user.entity';
import { IUserDoc, IUserEntity } from './user.interface';
import { UserCreateRequestDto } from '../dtos/request/user.create.request.dto';
import { IAuthPassword } from '@/modules/auth/interfaces/auth.interface';
import { ENUM_USER_SIGN_UP_FROM } from '../enums/user.enum';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { UserUpdatePasswordAttemptRequestDto } from '../dtos/request/user.update-password-attempt.request.dto';
import { UserUpdateRequestDto } from '../dtos/request/user.update.request.dto';
import { UserUpdateMobileNumberRequestDto } from '../dtos/request/user.update-mobile-number.request.dto';
import { UserUpdateProfileRequestDto } from '../dtos/request/user.update-profile.dto';
import { UserUploadPhotoRequestDto } from '../dtos/request/user.upload-photo.request.dto';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { UserListResponseDto } from '../dtos/response/user.list.response.dto';
import { UserCensorResponseDto } from '../dtos/response/user.censor.response.dto';
import { UserShortResponseDto } from '../dtos/response/user.short.response.dto';
import { UserGetResponseDto } from '../dtos/response/user.get.response.dto';
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';

export interface IUserService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<UserDoc[]>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  createRawQueryFindAllWithRole(find?: Record<string, any>): PipelineStage[];

  findAllWithRole(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IUserEntity[]>;

  getTotalWithRole(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(_id: string, options?: IDatabaseOptions): Promise<UserDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseOptions,
  ): Promise<UserDoc | null>;

  findOneByEmail(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc | null>;
  findOneByPhone(
    phone: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc | null>;

  findOneWithRole(
    find?: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc | null>;

  findOneWithRoleById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc | null>;

  findAllActiveWithRole(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserDoc[]>;

  getTotalActive(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  findOneActiveById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<IUserDoc | null>;

  findOneActiveByEmail(
    email: string,
    options?: IDatabaseOptions,
  ): Promise<IUserDoc | null>;

  findOneActiveByMobileNumber(
    phone: string,
    options?: IDatabaseOptions,
  ): Promise<IUserDoc | null>;

  create(
    { email, name, role, phone }: UserCreateRequestDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    signUpForm: ENUM_USER_SIGN_UP_FROM,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc>;

  signUp(
    role: string,
    { email, name, phone }: AuthSignUpRequestDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc>;

  existByRole(role: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  existByEmail(
    email: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean>;

  updatePhoto(
    repository: UserDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;

  updatePassword(
    repository: UserDoc,
    { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;

  updatePasswordAttempt(
    repository: UserDoc,
    { passwordAttempt }: UserUpdatePasswordAttemptRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;

  increasePasswordAttempt(
    repository: UserDoc,
    options?: IDatabaseUpdateOptions,
  ): Promise<UserDoc | null>;

  update(
    repository: UserDoc,
    { name, phone }: UserUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;

  updateMobileNumber(
    repository: UserDoc,
    { phone }: UserUpdateMobileNumberRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;

  softDelete(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  updateProfile(
    repository: UserDoc,
    { name }: UserUpdateProfileRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;

  join(repository: UserDoc): Promise<IUserDoc>;

  createRandomFilenamePhoto(
    user: string,
    { mime }: UserUploadPhotoRequestDto,
  ): string;

  mapProfile(user: IUserDoc | IUserEntity): UserProfileResponseDto;
  mapList(users: IUserDoc[] | IUserEntity[]): UserListResponseDto[];
  mapCensor(user: UserDoc | UserEntity): UserCensorResponseDto;
  mapShort(users: IUserDoc[] | IUserEntity[]): UserShortResponseDto[];
  mapGet(user: IUserDoc | IUserEntity): UserGetResponseDto;
}
