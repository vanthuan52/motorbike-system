import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { Prisma, ServiceChecklist } from '@/generated/prisma-client';

export interface IServiceChecklistService {
  existByName(name: string): Promise<boolean>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<ServiceChecklist>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<ServiceChecklist>>;

  findOneById(id: string): Promise<ServiceChecklist>;

  findOne(find: Record<string, any>): Promise<ServiceChecklist | null>;

  create(payload: ServiceChecklistCreateRequestDto): Promise<{ id: string }>;

  createMany(data: ServiceChecklistCreateRequestDto[]): Promise<number>;

  update(id: string, payload: ServiceChecklistUpdateRequestDto): Promise<void>;

  delete(id: string): Promise<void>;
}
