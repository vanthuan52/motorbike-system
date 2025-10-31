import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
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
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { UserVehicleGetFullResponseDto } from '../dtos/response/user-vehicle.full.response.dto';
import { UserVehicleGetResponseDto } from '../dtos/response/user-vehicle.get.response.dto';

@Injectable()
export class UserVehicleService implements IUserVehicleService {
  private readonly uploadPath: string;

  constructor(
    private readonly userVehicleRepository: UserVehicleRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
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

  async findAllWithVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IUserVehicleEntity[]> {
    return this.userVehicleRepository.findAll<IUserVehicleEntity>(find, {
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
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserVehicleDoc | null> {
    return this.userVehicleRepository.findOneById<UserVehicleDoc>(_id, options);
  }

  async findOneWithVehicleModelById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserVehicleDoc | null> {
    return this.userVehicleRepository.findOneById<IUserVehicleDoc>(_id, {
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
  ): Promise<UserVehicleDoc | null> {
    return this.userVehicleRepository.findOne<UserVehicleDoc>(find, options);
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
    const create: UserVehicleEntity = new UserVehicleEntity();
    create.user = user;
    create.vehicleModel = vehicleModel;
    create.user = user;
    create.modelYear = modelYear;
    create.licensePlateNumber = licensePlateNumber;
    create.engineNumber = engineNumber;
    create.chassisNumber = chassisNumber;
    create.color = color;

    return this.userVehicleRepository.create<UserVehicleEntity>(
      create,
      options,
    );
  }

  async update(
    repository: UserVehicleDoc,
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
  ): Promise<UserVehicleDoc> {
    repository.user = user ?? repository.user;
    repository.vehicleModel = vehicleModel ?? repository.vehicleModel;
    repository.modelYear = modelYear;
    repository.licensePlateNumber =
      licensePlateNumber ?? repository.licensePlateNumber;
    repository.engineNumber = engineNumber ?? repository.engineNumber;
    repository.chassisNumber = chassisNumber ?? repository.chassisNumber;
    repository.color = color ?? repository.color;

    return this.userVehicleRepository.save(repository, options);
  }

  async delete(
    repository: UserVehicleDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<boolean> {
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
    const randomPath = this.helperStringService.random(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  mapList(
    UserVehicle: UserVehicleDoc[] | IUserVehicleEntity[],
  ): UserVehicleListResponseDto[] {
    return plainToInstance(
      UserVehicleListResponseDto,
      UserVehicle.map((p: UserVehicleDoc | IUserVehicleEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    UserVehicle: UserVehicleDoc | IUserVehicleEntity,
  ): UserVehicleGetResponseDto {
    return plainToInstance(
      UserVehicleGetResponseDto,
      typeof (UserVehicle as any).toObject === 'function'
        ? (UserVehicle as any).toObject()
        : UserVehicle,
    );
  }

  mapGetPopulate(
    UserVehicle: UserVehicleDoc | IUserVehicleEntity,
  ): UserVehicleGetFullResponseDto {
    return plainToInstance(
      UserVehicleGetFullResponseDto,
      typeof (UserVehicle as any).toObject === 'function'
        ? (UserVehicle as any).toObject()
        : UserVehicle,
    );
  }

  async updatePhoto(
    repository: UserVehicleDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserVehicleDoc> {
    repository.photo = {
      ...photo,
      size: new Types.Decimal128(photo.size.toString()),
    };

    return this.userVehicleRepository.save(repository, options);
  }
}
