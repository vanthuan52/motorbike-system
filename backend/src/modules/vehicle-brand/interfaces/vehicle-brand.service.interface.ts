import { VehicleBrand, Prisma } from '@/generated/prisma-client';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IVehicleBrandService {
  findAll(find?: Prisma.VehicleBrandWhereInput): Promise<VehicleBrand[]>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleBrand[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleBrand[]; total?: number }>;

  findOneById(id: string): Promise<VehicleBrand>;

  findOne(find: Prisma.VehicleBrandWhereInput): Promise<VehicleBrand>;

  getTotal(find?: Prisma.VehicleBrandWhereInput): Promise<number>;

  create(payload: VehicleBrandCreateRequestDto): Promise<VehicleBrand>;

  update(id: string, payload: VehicleBrandUpdateRequestDto): Promise<void>;

  updateStatus(
    id: string,
    payload: VehicleBrandUpdateStatusRequestDto,
  ): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(find?: Prisma.VehicleBrandWhereInput): Promise<boolean>;

  findBySlug(slug: string): Promise<VehicleBrand>;

  existByName(name: string): Promise<boolean>;

  existBySlug(slug: string): Promise<boolean>;
}
