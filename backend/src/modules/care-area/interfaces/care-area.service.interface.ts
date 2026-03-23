import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { CareArea, Prisma } from '@/generated/prisma-client';
import { ENUM_VEHICLE_MODEL_TYPE } from '@/modules/vehicle-model/enums/vehicle-model.enum';

export interface ICareAreaService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: CareArea[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: Record<string, any>,
  ): Promise<{ data: CareArea[]; total?: number }>;

  getListOffsetWithServiceChecklists(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    vehicleType?: ENUM_VEHICLE_MODEL_TYPE,
  ): Promise<{
    data: CareArea[];
    total: number;
    checklistMap: Map<string, any[]>;
  }>;

  findOneById(id: string): Promise<CareArea>;

  findOne(where: Prisma.CareAreaWhereInput): Promise<CareArea | null>;

  create(payload: CareAreaCreateRequestDto): Promise<{ id: string }>;

  createMany(data: CareAreaCreateRequestDto[]): Promise<boolean>;

  update(id: string, payload: CareAreaUpdateRequestDto): Promise<void>;

  delete(id: string): Promise<void>;

  existByName(name: string): Promise<boolean>;
}
