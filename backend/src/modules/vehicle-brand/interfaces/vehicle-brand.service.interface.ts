import { Prisma } from '@/generated/prisma-client';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { VehicleBrandModel } from '../models/vehicle-brand.model';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';

export interface IVehicleBrandService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<VehicleBrandModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<VehicleBrandModel>>;

  findOneById(id: string): Promise<VehicleBrandModel>;

  findOne(
    find: Prisma.VehicleBrandWhereInput
  ): Promise<VehicleBrandModel | null>;

  create(
    payload: VehicleBrandCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<VehicleBrandModel>;

  update(
    id: string,
    payload: VehicleBrandUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleBrandModel>;

  updateStatus(
    id: string,
    payload: VehicleBrandUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleBrandModel>;

  delete(id: string, requestLog: IRequestLog, deletedBy: string): Promise<VehicleBrandModel>;

  findBySlug(slug: string): Promise<VehicleBrandModel>;

  existByName(name: string): Promise<boolean>;

  existBySlug(slug: string): Promise<boolean>;
}
