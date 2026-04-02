import { VehicleServiceModel } from '../models/vehicle-service.model';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleServiceUploadPhotoRequestDto } from '../dtos/request/vehicle-service.upload-photo.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IVehicleServiceListFilters } from './vehicle-service.filter.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { Prisma } from '@/generated/prisma-client';

export interface IVehicleServiceService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: IVehicleServiceListFilters
  ): Promise<IPaginationOffsetReturn<VehicleServiceModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: IVehicleServiceListFilters
  ): Promise<IPaginationCursorReturn<VehicleServiceModel>>;

  findOneById(id: string): Promise<VehicleServiceModel>;

  findOne(
    find: Prisma.VehicleServiceWhereInput
  ): Promise<VehicleServiceModel | null>;

  create(
    payload: VehicleServiceCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<VehicleServiceModel>;

  update(
    id: string,
    payload: VehicleServiceUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleServiceModel>;

  updateStatus(
    id: string,
    payload: VehicleServiceUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleServiceModel>;

  delete(id: string, requestLog: IRequestLog, deletedBy: string): Promise<VehicleServiceModel>;

  findBySlug(slug: string): Promise<VehicleServiceModel>;

  createRandomFilenamePhoto(
    vehicleService: string,
    payload: VehicleServiceUploadPhotoRequestDto
  ): string;

  updatePhoto(id: string, photo: AwsS3Dto): Promise<VehicleServiceModel>;
}
