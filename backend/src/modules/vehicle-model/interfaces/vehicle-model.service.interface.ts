import { VehicleModelModel } from '../models/vehicle-model.model';
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleModelUploadPhotoRequestDto } from '../dtos/request/vehicle-model.upload-photo.request.dto';
import {
  IPaginationCursorReturn,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { Prisma } from '@/generated/prisma-client';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IVehicleModelListFilters } from './vehicle-model.filter.interface';

export interface IVehicleModelService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: IVehicleModelListFilters
  ): Promise<IPaginationOffsetReturn<VehicleModelModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: IVehicleModelListFilters
  ): Promise<IPaginationCursorReturn<VehicleModelModel>>;

  findOneById(id: string): Promise<VehicleModelModel>;

  findOne(
    find: Prisma.VehicleModelWhereInput
  ): Promise<VehicleModelModel | null>;

  create(
    payload: VehicleModelCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<VehicleModelModel>;

  update(
    id: string,
    payload: VehicleModelUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleModelModel>;

  updateStatus(
    id: string,
    payload: VehicleModelUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleModelModel>;

  delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<VehicleModelModel>;

  findBySlug(slug: string): Promise<VehicleModelModel>;

  createRandomFilenamePhoto(
    vehicleModel: string,
    payload: VehicleModelUploadPhotoRequestDto
  ): string;
}
