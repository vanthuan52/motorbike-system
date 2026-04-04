import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { EnumVehicleModelType } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { CareAreaModel } from '../models/care-area.model';
import { Prisma } from '@/generated/prisma-client';
import { ICareAreaListFilters } from './care-area.filter.interface';

export interface ICareAreaService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: ICareAreaListFilters
  ): Promise<IPaginationOffsetReturn<CareAreaModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: ICareAreaListFilters
  ): Promise<IPaginationCursorReturn<CareAreaModel>>;

  getListOffsetWithServiceChecklists(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    vehicleType?: EnumVehicleModelType
  ): Promise<
    IPaginationOffsetReturn<CareAreaModel> & {
      checklistMap: Map<string, any[]>;
    }
  >;

  findOneById(id: string): Promise<CareAreaModel>;

  findOne(where: Prisma.CareAreaWhereInput): Promise<CareAreaModel | null>;

  create(
    payload: CareAreaCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareAreaModel>;

  createMany(
    data: CareAreaCreateRequestDto[],
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<boolean>;

  update(
    id: string,
    payload: CareAreaUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareAreaModel>;

  delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareAreaModel>;

  existByName(name: string): Promise<boolean>;

  // === Trash/Restore ===

  getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: ICareAreaListFilters
  ): Promise<IPaginationOffsetReturn<CareAreaModel>>;

  restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<CareAreaModel>;

  forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<CareAreaModel>;
}
