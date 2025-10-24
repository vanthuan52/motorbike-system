import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Document, FilterQuery, PipelineStage, Types } from 'mongoose';
import { IUserService } from '../interfaces/user.service.interface';
import { UserRepository } from '../repository/user.repository';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
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
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { UserDoc, UserEntity } from '../entities/user.entity';
import { DatabaseHelperQueryContain } from '@/common/database/decorators/database.decorator';
import { ENUM_USER_SIGN_UP_FROM, ENUM_USER_STATUS } from '../enums/user.enum';
import { IUserDoc, IUserEntity } from '../interfaces/user.interface';
import { IAuthPassword } from '@/modules/auth/interfaces/auth.interface';
import { UserCreateRequestDto } from '../dtos/request/user.create.request.dto';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { UserUpdateStatusRequestDto } from '../dtos/request/user.update-status.request.dto';
import { UserUpdatePasswordAttemptRequestDto } from '../dtos/request/user.update-password-attempt.request.dto';
import { UserUpdateRequestDto } from '../dtos/request/user.update.request.dto';
import { UserUpdateMobileNumberRequestDto } from '../dtos/request/user.update-mobile-number.request.dto';
import { UserUpdateProfileRequestDto } from '../dtos/request/user.update-profile.dto';
import { UserUploadPhotoRequestDto } from '../dtos/request/user.upload-photo.request.dto';
import { UserGetResponseDto } from '../dtos/response/user.get.response.dto';
import { UserShortResponseDto } from '../dtos/response/user.short.response.dto';
import { UserListResponseDto } from '../dtos/response/user.list.response.dto';
import { UserCensorResponseDto } from '../dtos/response/user.censor.response.dto';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { RoleTableName } from '@/modules/role/entities/role.entity';
import { UserPreCreateRequestDto } from '../dtos/request/user.pre-create.request.dto';

@Injectable()
export class UserService implements IUserService {
  private readonly uploadPath: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {
    this.uploadPath = this.configService.get<string>('user.uploadPath') || '';
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<UserDoc[]> {
    return this.userRepository.findAll<UserDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.userRepository.getTotal(find, options);
  }

  createRawQueryFindAllWithRole(find?: Record<string, any>): PipelineStage[] {
    return [
      {
        $lookup: {
          from: RoleTableName,
          as: 'role',
          foreignField: '_id',
          localField: 'role',
        },
      },
      {
        $unwind: '$role',
      },
      {
        $match: find as FilterQuery<any>,
      },
    ];
  }

  async findAllWithRole(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IUserEntity[]> {
    const pipeline: PipelineStage[] = this.createRawQueryFindAllWithRole(find);

    return this.userRepository.findAllAggregate<IUserEntity>(pipeline, options);
  }

  async getTotalWithRole(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    const pipeline: PipelineStage[] = this.createRawQueryFindAllWithRole(find);

    return this.userRepository.getTotalAggregate(pipeline, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc | null> {
    return this.userRepository.findOneById<UserDoc>(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc | null> {
    return this.userRepository.findOne<UserDoc>(find, options);
  }

  async findOneByPhone(
    phone: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc | null> {
    return this.userRepository.findOne<UserDoc>(
      {
        phone: phone,
      },
      options,
    );
  }

  async findOneByEmail(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDoc | null> {
    return this.userRepository.findOne<UserDoc>(
      DatabaseHelperQueryContain('email', email, { fullWord: true }),
      options,
    );
  }

  async findOneWithRole(
    find?: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc | null> {
    const actualFind = find ?? {};

    return this.userRepository.findOne<IUserDoc>(actualFind, {
      ...options,
      join: true,
    });
  }

  async findOneWithRoleById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc | null> {
    return this.userRepository.findOneById<IUserDoc>(_id, {
      ...options,
      join: true,
    });
  }

  async findAllActiveWithRole(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserDoc[]> {
    return this.userRepository.findAll<IUserDoc>(
      { ...find, status: ENUM_USER_STATUS.ACTIVE },
      {
        ...options,
        join: this.userRepository._joinActive,
      },
    );
  }

  async getTotalActive(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.userRepository.getTotal(
      { ...find, status: ENUM_USER_STATUS.ACTIVE },
      {
        ...options,
        join: this.userRepository._joinActive,
      },
    );
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserDoc[]> {
    return this.userRepository.findAll<IUserDoc>(
      { ...find, status: ENUM_USER_STATUS.ACTIVE },
      {
        ...options,
        join: this.userRepository._joinActive,
      },
    );
  }

  async findOneActiveById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserDoc | null> {
    return this.userRepository.findOne<IUserDoc>(
      { _id, status: ENUM_USER_STATUS.ACTIVE },
      {
        ...options,
        join: this.userRepository._joinActive,
      },
    );
  }

  async findOneActiveByEmail(
    email: string,
    options?: IDatabaseOptions,
  ): Promise<IUserDoc | null> {
    return this.userRepository.findOne<IUserDoc>(
      {
        ...DatabaseHelperQueryContain('email', email, {
          fullWord: true,
        }),
        status: ENUM_USER_STATUS.ACTIVE,
      },
      {
        ...options,
        join: this.userRepository._joinActive,
      },
    );
  }

  async findOneActiveByMobileNumber(
    phone: string,
    options?: IDatabaseOptions,
  ): Promise<IUserDoc | null> {
    return this.userRepository.findOne<IUserDoc>({});
  }

  async create(
    { email, name, role, phone }: UserCreateRequestDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    signUpForm: ENUM_USER_SIGN_UP_FROM,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    const create: UserEntity = new UserEntity();
    create.name = name;
    create.email = email.toLowerCase();
    create.role = role;
    create.status = ENUM_USER_STATUS.ACTIVE;
    create.password = passwordHash;

    return this.userRepository.create<UserEntity>(create, options);
  }

  async preCreate(
    { name, phone, email, role }: UserPreCreateRequestDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    signUpForm: ENUM_USER_SIGN_UP_FROM,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    const create: UserEntity = new UserEntity();
    create.name = name;
    create.phone = phone;
    create.email = this.createTempEmail(phone);
    create.role = role;
    create.status = ENUM_USER_STATUS.ACTIVE;
    create.password = passwordHash;

    return this.userRepository.create<UserEntity>(create, options);
  }

  async signUp(
    role: string,
    { email, name, phone }: AuthSignUpRequestDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    const create: UserEntity = new UserEntity();
    create.name = name;
    create.email = email.toLowerCase();
    create.phone = phone;
    create.role = role;
    create.status = ENUM_USER_STATUS.ACTIVE;
    create.password = passwordHash;

    return this.userRepository.create<UserEntity>(create, options);
  }

  async existByRole(
    role: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    return this.userRepository.exists({ role, options });
  }

  async existByEmail(
    email: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      DatabaseHelperQueryContain('email', email, { fullWord: true }),
      options,
    );
  }

  async existByPhone(
    phone: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      DatabaseHelperQueryContain('phone', phone, { fullWord: true }),
      options,
    );
  }

  async updatePhoto(
    repository: UserDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.photo = {
      ...photo,
      size: new Types.Decimal128(photo.size.toString()),
    };

    return this.userRepository.save(repository, options);
  }

  async updatePassword(
    repository: UserDoc,
    { passwordHash }: IAuthPassword,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.password = passwordHash;

    return this.userRepository.save(repository, options);
  }

  async updateStatus(
    repository: UserDoc,
    { status }: UserUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserEntity> {
    repository.status = status;

    return this.userRepository.save(repository, options);
  }

  async updatePasswordAttempt(
    repository: UserDoc,
    { passwordAttempt }: UserUpdatePasswordAttemptRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    return this.userRepository.save(repository, options);
  }

  async increasePasswordAttempt(
    repository: UserDoc,
    options?: IDatabaseUpdateOptions,
  ): Promise<UserDoc | null> {
    return this.userRepository.updateRaw(
      { _id: repository._id },
      {
        $inc: {
          passwordAttempt: 1,
        },
      },
      options,
    );
  }

  async update(
    repository: UserDoc,
    { name, phone }: UserUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.name = name;
    repository.phone = phone;

    return this.userRepository.save(repository, options);
  }

  async updateMobileNumber(
    repository: UserDoc,
    { phone }: UserUpdateMobileNumberRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.phone = phone;

    return this.userRepository.save(repository, options);
  }

  async softDelete(
    repository: UserDoc,
    options?: IDatabaseSoftDeleteOptions,
  ): Promise<UserDoc> {
    return this.userRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.userRepository.deleteMany(find, options);

    return true;
  }

  async updateProfile(
    repository: UserDoc,
    { name }: UserUpdateProfileRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.name = name;

    return this.userRepository.save(repository, options);
  }

  async join(repository: UserDoc): Promise<IUserDoc> {
    return this.userRepository.join(repository, this.userRepository._join!);
  }

  createTempEmail(temp: string): string {
    return `temp_${temp}@antmotor.vn`;
  }

  createRandomFilenamePhoto(
    user: string,
    { mime }: UserUploadPhotoRequestDto,
  ): string {
    let path: string = this.uploadPath.replace('{user}', user);
    const randomPath = this.helperStringService.random(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  mapProfile(user: IUserDoc | IUserEntity): UserProfileResponseDto {
    return plainToInstance(
      UserProfileResponseDto,
      user instanceof Document ? user.toObject() : user,
    );
  }

  mapCensor(user: UserDoc | UserEntity): UserCensorResponseDto {
    const plainObject = user instanceof Document ? user.toObject() : user;
    plainObject.name = this.helperStringService.censor(plainObject.name);

    return plainToInstance(UserCensorResponseDto, plainObject);
  }

  mapList(
    users: IUserDoc[] | IUserEntity[] | UserDoc[],
  ): UserListResponseDto[] {
    return plainToInstance(
      UserListResponseDto,
      users.map((u: IUserDoc | IUserEntity | UserDoc) =>
        u instanceof Document ? u.toObject() : u,
      ),
    );
  }

  mapShort(users: IUserDoc[] | IUserEntity[]): UserShortResponseDto[] {
    return plainToInstance(
      UserShortResponseDto,
      users.map((u: IUserDoc | IUserEntity) =>
        u instanceof Document ? u.toObject() : u,
      ),
    );
  }

  mapGet(user: IUserDoc | IUserEntity): UserGetResponseDto {
    return plainToInstance(
      UserGetResponseDto,
      user instanceof Document ? user.toObject() : user,
    );
  }
}
