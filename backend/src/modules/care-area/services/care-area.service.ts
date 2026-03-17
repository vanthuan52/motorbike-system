import { Injectable, NotFoundException } from '@nestjs/common';
import { CareAreaRepository } from '../repository/care-area.repository';
import { ICareAreaService } from '../interfaces/care-area.service.interface';
import {
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { ServiceChecklistService } from '@/modules/service-checklist/services/service-checklist.service';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import { ENUM_VEHICLE_MODEL_TYPE } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { ENUM_CARE_AREA_STATUS_CODE_ERROR } from '../enums/care-area.status-code.enum';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseHelperQueryContain } from '@/common/database/decorators/database.decorator';
import { CareAreaDoc, CareAreaEntity } from '../entities/care-area.entity';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';

@Injectable()
export class CareAreaService implements ICareAreaService {
  constructor(
    private readonly careAreaRepository: CareAreaRepository,
    private readonly serviceChecklistService: ServiceChecklistService,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareAreaDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [careAreas, total] = await Promise.all([
      this.careAreaRepository.findAll<CareAreaDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.careAreaRepository.getTotal(find),
    ]);

    return {
      data: careAreas,
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
  ): Promise<{ data: CareAreaDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...filters };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.careAreaRepository.findAllCursor(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
      }),
      includeCount
        ? this.careAreaRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    return { data, total: count };
  }

  async getListOffsetWithServiceChecklists(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    vehicleType?: ENUM_VEHICLE_MODEL_TYPE,
  ): Promise<{
    data: CareAreaDoc[];
    total: number;
    checklistMap: Map<string, any[]>;
  }> {
    const find: Record<string, any> = {
      ...where,
    };

    const careAreas = await this.careAreaRepository.findAll<CareAreaDoc>(find, {
      paging: { limit, offset: skip },
      order: { order: EnumPaginationOrderDirectionType.asc },
    });

    const checklistMap = new Map<string, any[]>();

    for (const careArea of careAreas) {
      const serviceChecklistFind: Record<string, any> = {
        careArea: careArea._id,
      };

      if (vehicleType) {
        serviceChecklistFind.vehicleType = { $in: [vehicleType] };
      }

      const { data: serviceChecklists } =
        await this.serviceChecklistService.getListOffset({
          limit: 1000,
          skip: 0,
          where: serviceChecklistFind,
          orderBy: { order: EnumPaginationOrderDirectionType.asc },
          include: undefined,
        });

      checklistMap.set(
        careArea._id.toString(),
        serviceChecklists as unknown as any[],
      );
    }

    const total = await this.careAreaRepository.getTotal(find);

    return {
      data: careAreas,
      total,
      checklistMap,
    };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareAreaDoc> {
    const careArea = await this.findOneByIdOrFail(id, options);
    return careArea;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareAreaDoc> {
    const careArea = await this.careAreaRepository.findOne<CareAreaDoc>(
      find,
      options,
    );
    return careArea;
  }

  async create(
    { name, description, order }: CareAreaCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto> {
    const create: CareAreaEntity = new CareAreaEntity();
    create.name = name;
    create.description = description;
    create.order = order;

    const created = await this.careAreaRepository.create<CareAreaEntity>(
      create,
      options,
    );

    return { _id: created._id };
  }

  async update(
    id: string,
    { name, description, order }: CareAreaUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.name = name ?? repository.name;
    repository.description = description ?? repository.description;
    repository.order = order ?? repository.order;
    await this.careAreaRepository.save(repository, options);
  }

  async softDelete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.careAreaRepository.softDelete(repository, options);
  }

  async delete(id: string, options?: IDatabaseDeleteOptions): Promise<void> {
    await this.careAreaRepository.delete({ _id: id }, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careAreaRepository.deleteMany(find, options);
    return true;
  }

  async createMany(
    data: CareAreaCreateRequestDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean> {
    const create = data.map((item) => {
      const doc: any = {
        name: item.name,
        description: item.description,
        order: item.order,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
        __v: 0,
      };

      if ('_id' in item && (item as any)._id) {
        doc._id = (item as any)._id;
      }

      return doc;
    });

    await this.careAreaRepository['_repository'].insertMany(create, {
      ordered: false,
    });

    return true;
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareAreaDoc> {
    const careArea = await this.careAreaRepository.findOneById<CareAreaDoc>(
      id,
      options,
    );
    if (!careArea) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_AREA_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-area.error.notFound',
      });
    }
    return careArea;
  }

  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const exist = await this.careAreaRepository.exists(
      DatabaseHelperQueryContain('name', name, { fullWord: true }),
      options,
    );

    return exist;
  }
}
