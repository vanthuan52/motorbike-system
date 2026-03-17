import { PipelineStage } from 'mongoose';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { VehicleModelDoc } from '../entities/vehicle-model.entity';
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { VehicleModelDto } from '../dtos/vehicle-model.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleModelUploadPhotoRequestDto } from '../dtos/request/vehicle-model.upload-photo.request.dto';
import {
  IVehicleModelDoc,
  IVehicleModelEntity,
} from './vehicle-model.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';

export interface IVehicleModelService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleModelDoc[]>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleModelDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleModelDoc[]; total?: number }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleModelDoc>;

  findOneWithVehicleBrandById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IVehicleModelDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleModelDoc>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: VehicleModelCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleModelDoc>;

  update(
    id: string,
    payload: VehicleModelUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: VehicleModelUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  findBySlug(slug: string): Promise<VehicleModelDoc>;

  createRandomFilenamePhoto(
    vehicleModel: string,
    payload: VehicleModelUploadPhotoRequestDto,
  ): string;

  updatePhoto(
    repository: VehicleModelDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleModelDoc>;
}
