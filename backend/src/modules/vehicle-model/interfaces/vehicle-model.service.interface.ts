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
import { VehicleModelDoc } from '../entities/vehicle-model.entity';
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import { VehicleModelGetResponseDto } from '../dtos/response/vehicle-model.get.response.dto';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { VehicleModelUploadPhotoRequestDto } from '../dtos/request/vehicle-model.upload-photo.request.dto';
import {
  IVehicleModelDoc,
  IVehicleModelEntity,
} from './vehicle-model.interface';

export interface IVehicleModelService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleModelDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleModelDoc[]>;

  createRawQueryFindAllWithVehicleBrand(
    find?: Record<string, any>,
  ): PipelineStage[];

  findAllWithVehicleBrand(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IVehicleModelEntity[]>;

  getTotalWithVehicleBrand(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<VehicleModelDoc | null>;

  findOneWithVehicleBrandById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IVehicleModelDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleModelDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: VehicleModelCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleModelDoc>;

  update(
    repository: VehicleModelDoc,
    payload: VehicleModelUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleModelDoc>;

  softDelete(
    repository: VehicleModelDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleModelDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  existBySlug(slug: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  createSlug(name: string): string;

  updatePhoto(
    repository: VehicleModelDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleModelDoc>;

  createRandomFilenamePhoto(
    user: string,
    { mime }: VehicleModelUploadPhotoRequestDto,
  ): string;

  mapList(data: VehicleModelDoc[]): VehicleModelListResponseDto[];
  mapGet(data: VehicleModelDoc): VehicleModelGetResponseDto;
}
