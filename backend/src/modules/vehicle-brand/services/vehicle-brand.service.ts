import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { VehicleBrandRepository } from '../repository/vehicle-brand.repository';
import { IVehicleBrandService } from '../interfaces/vehicle-brand.service.interface';
import {
  VehicleBrandDoc,
  VehicleBrandEntity,
} from '../entities/vehicle-brand.entity';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { ENUM_VEHICLE_BRAND_STATUS } from '../enums/vehicle-brand.enum';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';
import { VehicleBrandUtil } from '../utils/vehicle-brand.util';
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR } from '../enums/vehicle-brand.status-code.enum';

@Injectable()
export class VehicleBrandService implements IVehicleBrandService {
  constructor(
    private readonly vehicleBrandRepository: VehicleBrandRepository,
    private readonly vehicleBrandUtil: VehicleBrandUtil,
  ) {}

  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne(
      { name },
      options,
    );
    return !!vehicleBrand;
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne(
      { slug },
      options,
    );
    return !!vehicleBrand;
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleBrandDoc[]> {
    return this.vehicleBrandRepository.findAll<VehicleBrandDoc>(find, options);
  }

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleBrandDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [vehicleBrands, total] = await Promise.all([
      this.vehicleBrandRepository.findAll<VehicleBrandDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.vehicleBrandRepository.getTotal(find),
    ]);

    return {
      data: vehicleBrands,
      total,
    };
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleBrandDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...filters };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.vehicleBrandRepository.findAllCursor<VehicleBrandDoc>(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
      }),
      includeCount
        ? this.vehicleBrandRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data.slice(0, limit);

    return { data: items, total: count };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleBrandDoc> {
    const vehicleBrand = await this.findOneByIdOrFail(id, options);
    return vehicleBrand;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleBrandDoc> {
    const vehicleBrand =
      await this.vehicleBrandRepository.findOne<VehicleBrandDoc>(find, options);
    if (!vehicleBrand) {
      return null as any;
    }
    return vehicleBrand;
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.vehicleBrandRepository.getTotal(find, options);
  }

  async create(
    { name, slug, description, order, country }: VehicleBrandCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleBrandDoc> {
    // Check slug conflict
    const existingSlug = await this.vehicleBrandRepository.findOne({ slug });
    if (existingSlug) {
      throw new ConflictException({
        statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.SLUG_EXISTED,
        message: 'vehicle-brand.error.slugExisted',
      });
    }

    const create: VehicleBrandEntity = new VehicleBrandEntity();
    create.name = name;
    create.slug = slug.toLowerCase();
    create.country = country;
    create.description = description;
    create.order = order;
    create.status = ENUM_VEHICLE_BRAND_STATUS.ACTIVE;

    const created =
      await this.vehicleBrandRepository.create<VehicleBrandEntity>(
        create,
        options,
      );

    return created;
  }

  async update(
    id: string,
    { name, slug, description, order, country }: VehicleBrandUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    // Check slug conflict if slug is being updated
    if (slug && slug !== repository.slug) {
      const existingSlug = await this.vehicleBrandRepository.findOne({ slug });
      if (existingSlug && existingSlug._id.toString() !== id) {
        throw new ConflictException({
          statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'vehicle-brand.error.slugExisted',
        });
      }
    }

    repository.name = name ?? repository.name;
    repository.slug = slug ?? repository.slug;
    repository.description = description;
    repository.order = order;
    repository.country = country;

    await this.vehicleBrandRepository.save(repository, options);
  }

  async updateStatus(
    id: string,
    { status }: VehicleBrandUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.status = status;

    await this.vehicleBrandRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.vehicleBrandRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.vehicleBrandRepository.deleteMany(find, options);
    return true;
  }

  async findBySlug(slug: string): Promise<VehicleBrandDoc> {
    const vehicleBrand = await this.vehicleBrandRepository.findOneBySlug(slug);
    if (!vehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    }
    return vehicleBrand;
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleBrandDoc> {
    const vehicleBrand =
      await this.vehicleBrandRepository.findOneById<VehicleBrandDoc>(
        id,
        options,
      );
    if (!vehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    }
    return vehicleBrand;
  }
}
