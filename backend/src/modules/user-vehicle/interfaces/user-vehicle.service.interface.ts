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
import { UserVehicleDoc } from '../entities/user-vehicle.entity';
import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { UserVehicleUploadPhotoRequestDto } from '../dtos/request/user-vehicle.upload-photo.request.dto';
import { IUserVehicleDoc, IUserVehicleEntity } from './user-vehicle.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';
import { UserVehicleDto } from '../dtos/user-vehicle.dto';

export interface IUserVehicleService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<UserVehicleDoc[]>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: UserVehicleDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: UserVehicleDoc[]; total?: number }>;

  findAllWithVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<UserVehicleDoc[]>;

  getTotalWithVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserVehicleDoc>;

  findOneWithVehicleModelById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserVehicleDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserVehicleDoc>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: UserVehicleCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserVehicleDoc>;

  update(
    id: string,
    payload: UserVehicleUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseDeleteOptions): Promise<boolean>;

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
}
