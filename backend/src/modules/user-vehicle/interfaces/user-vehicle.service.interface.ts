import { PipelineStage } from 'mongoose';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { UserVehicleDoc } from '../entities/user-vehicle.entity';
import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import { UserVehicleGetResponseDto } from '../dtos/response/user-vehicle.get.response.dto';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { UserVehicleUploadPhotoRequestDto } from '../dtos/request/user-vehicle.upload-photo.request.dto';
import { IUserVehicleDoc, IUserVehicleEntity } from './user-vehicle.interface';

export interface IUserVehicleService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<UserVehicleDoc[]>;

  findAllWithVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IUserVehicleEntity[]>;

  getTotalWithVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<UserVehicleDoc | null>;

  findOneWithVehicleModelById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IUserVehicleDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserVehicleDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: UserVehicleCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserVehicleDoc>;

  update(
    repository: UserVehicleDoc,
    payload: UserVehicleUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserVehicleDoc>;

  delete(
    repository: UserVehicleDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<boolean>;

  softDelete(
    repository: UserVehicleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserVehicleDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  updatePhoto(
    repository: UserVehicleDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserVehicleDoc>;

  createRandomFilenamePhoto(
    user: string,
    { mime }: UserVehicleUploadPhotoRequestDto,
  ): string;

  mapList(data: UserVehicleDoc[]): UserVehicleListResponseDto[];
  mapGet(data: UserVehicleDoc): UserVehicleGetResponseDto;
}
