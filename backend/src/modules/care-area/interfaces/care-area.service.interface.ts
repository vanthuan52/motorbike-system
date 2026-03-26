import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { EnumVehicleModelType } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { CareArea, Prisma } from '@/generated/prisma-client';
import { IRequestLog } from '@/common/request/interfaces/request.interface';

export interface ICareAreaService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareArea>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<CareArea>>;

  getListOffsetWithServiceChecklists(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    vehicleType?: EnumVehicleModelType
  ): Promise<
    IPaginationOffsetReturn<CareArea> & { checklistMap: Map<string, any[]> }
  >;

  findOneById(id: string): Promise<CareArea>;

  findOne(where: Prisma.CareAreaWhereInput): Promise<CareArea | null>;

  create(
    payload: CareAreaCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<{ id: string }>;

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
  ): Promise<void>;

  delete(id: string, requestLog: IRequestLog, actionBy: string): Promise<void>;

  existByName(name: string): Promise<boolean>;
}
