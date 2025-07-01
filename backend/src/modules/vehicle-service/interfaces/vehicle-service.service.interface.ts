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
} from '@/common/database/interfaces/database.interface';
import { VehicleServiceDoc } from '../entities/vehicle-service.entity';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { VehicleServiceGetResponseDto } from '../dtos/response/vehicle-service.get.response.dto';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { VehicleServiceUploadPhotoRequestDto } from '../dtos/request/vehicle-service.upload-photo.request.dto';
import {
  IVehicleServiceDoc,
  IVehicleServiceEntity,
} from './vehicle-service.interface';

export interface IVehicleServiceService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleServiceDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleServiceDoc[]>;

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
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<VehicleServiceDoc | null>;

  findOneWithServiceCategoryById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IVehicleServiceDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleServiceDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: VehicleServiceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleServiceDoc>;

  update(
    repository: VehicleServiceDoc,
    payload: VehicleServiceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleServiceDoc>;

  softDelete(
    repository: VehicleServiceDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleServiceDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  existBySlug(slug: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  createSlug(name: string): string;

  updatePhoto(
    repository: VehicleServiceDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleServiceDoc>;

  createRandomFilenamePhoto(
    user: string,
    { mime }: VehicleServiceUploadPhotoRequestDto,
  ): string;

  mapList(data: VehicleServiceDoc[]): VehicleServiceListResponseDto[];
  mapGet(data: VehicleServiceDoc): VehicleServiceGetResponseDto;
}
