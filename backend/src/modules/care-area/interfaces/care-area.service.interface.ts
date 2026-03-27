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
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { CareAreaModel } from '../models/care-area.model';
import { Prisma } from '@/generated/prisma-client';

export interface ICareAreaService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareAreaModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: Record<string, any>
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
  ): Promise<IResponseReturn<{ id: string }>>;

  createMany(
    data: CareAreaCreateRequestDto[],
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<IResponseReturn<boolean>>;

  update(
    id: string,
    payload: CareAreaUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<IResponseReturn<void>>;

  delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<IResponseReturn<void>>;

  existByName(name: string): Promise<boolean>;
}
