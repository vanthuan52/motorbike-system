import { PipelineStage } from 'mongoose';
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
import { VehicleServiceDoc } from '../entities/vehicle-service.entity';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleServiceUploadPhotoRequestDto } from '../dtos/request/vehicle-service.upload-photo.request.dto';
import {
  IVehicleServiceDoc,
  IVehicleServiceEntity,
} from './vehicle-service.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';

export interface IVehicleServiceService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleServiceDoc[]>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleServiceDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleServiceDoc[]; total?: number }>;

  createRawQueryFindAllWithServiceCategory(
    find?: Record<string, any>,
  ): PipelineStage[];

  findAllWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IVehicleServiceEntity[]>;

  getTotalWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleServiceDoc>;

  findOneWithServiceCategoryById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IVehicleServiceDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleServiceDoc>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: VehicleServiceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleServiceDoc>;

  update(
    id: string,
    payload: VehicleServiceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: VehicleServiceUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseDeleteOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  findBySlug(slug: string): Promise<VehicleServiceDoc>;

  createRandomFilenamePhoto(
    vehicleService: string,
    payload: VehicleServiceUploadPhotoRequestDto,
  ): string;

  updatePhoto(
    repository: VehicleServiceDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleServiceDoc>;
}
