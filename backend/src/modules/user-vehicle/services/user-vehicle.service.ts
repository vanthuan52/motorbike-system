import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserVehicleRepository } from '../repository/user-vehicle.repository';
import { IUserVehicleService } from '../interfaces/user-vehicle.service.interface';
import {
  UserVehicleDoc,
  UserVehicleEntity,
} from '../entities/user-vehicle.entity';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import {
  IUserVehicleDoc,
  IUserVehicleEntity,
} from '../interfaces/user-vehicle.interface';
import { UserVehicleUploadPhotoRequestDto } from '../dtos/request/user-vehicle.upload-photo.request.dto';
import { HelperService } from '@/common/helper/services/helper.service';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { UserVehicleDto } from '../dtos/user-vehicle.dto';
import { UserVehicleUtil } from '../utils/user-vehicle.util';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { ENUM_USER_VEHICLE_STATUS_CODE_ERROR } from '../enums/user-vehicle.status-code.enum';
import { VehicleModelRepository } from '@/modules/vehicle-model/repository/vehicle-model.repository';
import { UserRepository } from '@/modules/user/repository/user.repository';

@Injectable()
export class UserVehicleService implements IUserVehicleService {
  private readonly uploadPath: string;

  constructor(
    private readonly userVehicleRepository: UserVehicleRepository,
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
  ) {
    this.uploadPath =
      this.configService.get<string>('userVehicle.uploadPath') || '';
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<UserVehicleDoc[]> {
    return this.userVehicleRepository.findAll<UserVehicleDoc>(find, options);
  }

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: UserVehicleDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [userVehicles, total] = await Promise.all([
      this.userVehicleRepository.findAll<UserVehicleDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: true,
      }),
      this.userVehicleRepository.getTotal(find),
    ]);

    return {
      data: userVehicles,
      total,
    };
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
    filters?: Record<string, any>,
  ): Promise<{ data: UserVehicleDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...filters };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.userVehicleRepository.findAllCursor<UserVehicleDoc>(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
        join: true,
      }),
      includeCount
        ? this.userVehicleRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data.slice(0, limit);

    return { data: items, total: count };
  }

  async findAllWithVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<UserVehicleDoc[]> {
    return this.userVehicleRepository.findAll<UserVehicleDoc>(find, {
      ...options,
      join: true,
    });
  }

  async getTotalWithVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.userVehicleRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserVehicleDoc> {
    const userVehicle = await this.findOneByIdOrFail(id, options);
    return userVehicle;
  }

  async findOneWithVehicleModelById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserVehicleDoc | null> {
    return this.userVehicleRepository.findOneById<UserVehicleDoc>(_id, {
      ...options,
      join: true,
    });
  }

  async join(repository: UserVehicleDoc): Promise<IUserVehicleDoc> {
    return this.userVehicleRepository.join(
      repository,
      this.userVehicleRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserVehicleDoc> {
    const userVehicle =
      await this.userVehicleRepository.findOne<UserVehicleDoc>(find, options);
    if (!userVehicle) {
      return null as any;
    }
    return userVehicle;
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.userVehicleRepository.getTotal(find, options);
  }

  async create(
    {
      user,
      vehicleModel,
      modelYear,
      licensePlateNumber,
      engineNumber,
      chassisNumber,
      color,
    }: UserVehicleCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserVehicleDoc> {
    const promises: Promise<any>[] = [
      this.vehicleModelRepository.findOneById(vehicleModel),
      this.userRepository.findOneById(user),
    ];

    const [checkVehicleModel, checkUser] = await Promise.all(promises);

    if (!checkVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }
    if (!checkUser) {
      throw new ConflictException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const create: UserVehicleEntity = new UserVehicleEntity();
    create.user = user;
    create.vehicleModel = vehicleModel;
    create.user = user;
    create.modelYear = modelYear;
    create.licensePlateNumber = licensePlateNumber;
    create.engineNumber = engineNumber;
    create.chassisNumber = chassisNumber;
    create.color = color;

    const created = await this.userVehicleRepository.create<UserVehicleEntity>(
      create,
      options,
    );

    return created;
  }

  async update(
    id: string,
    {
      user,
      vehicleModel,
      modelYear,
      licensePlateNumber,
      engineNumber,
      chassisNumber,
      color,
    }: UserVehicleUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    if (vehicleModel) {
      const checkVehicleModel =
        await this.vehicleModelRepository.findOneById(vehicleModel);

      if (!checkVehicleModel) {
        throw new NotFoundException({
          statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'user-vehicle.error.notFound',
        });
      }
    }

    repository.user = user ?? repository.user;
    repository.vehicleModel = vehicleModel ?? repository.vehicleModel;
    repository.modelYear = modelYear;
    repository.licensePlateNumber =
      licensePlateNumber ?? repository.licensePlateNumber;
    repository.engineNumber = engineNumber ?? repository.engineNumber;
    repository.chassisNumber = chassisNumber ?? repository.chassisNumber;
    repository.color = color ?? repository.color;

    await this.userVehicleRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseDeleteOptions): Promise<boolean> {
    const repository = await this.findOneByIdOrFail(id);
    await this.userVehicleRepository.delete({ _id: repository._id }, options);
    return true;
  }

  async softDelete(
    repository: UserVehicleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserVehicleDoc> {
    return this.userVehicleRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.userVehicleRepository.deleteMany(find, options);
    return true;
  }

  createRandomFilenamePhoto(
    UserVehicle: string,
    { mime }: UserVehicleUploadPhotoRequestDto,
  ): string {
    let path: string = this.uploadPath.replace('{UserVehicle}', UserVehicle);
    const randomPath = this.helperService.randomString(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  async updatePhoto(
    repository: UserVehicleDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserVehicleDoc> {
    repository.photo = {
      ...photo,
      size: photo.size,
    };

    return this.userVehicleRepository.save(repository, options);
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserVehicleDoc> {
    const userVehicle =
      await this.userVehicleRepository.findOneById<UserVehicleDoc>(id, options);
    if (!userVehicle) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user-vehicle.error.notFound',
      });
    }
    return userVehicle;
  }
}
