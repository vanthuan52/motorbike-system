import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CareAreaRepository } from '../repository/care-area.repository';
import { ICareAreaService } from '../interfaces/care-area.service.interface';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { ICareAreaMigrationCreate } from '../interfaces/care-area.migration.interface';
import { ServiceChecklistService } from '@/modules/service-checklist/services/service-checklist.service';
import { EnumVehicleModelType } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { EnumCareAreaStatusCodeError } from '../enums/care-area.status-code.enum';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareAreaUtil } from '../utils/care-area.util';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { CareAreaModel } from '../models/care-area.model';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import { Prisma } from '@/generated/prisma-client';
import { ICareAreaListFilters } from '../interfaces/care-area.filter.interface';

@Injectable()
export class CareAreaService implements ICareAreaService {
  constructor(
    private readonly careAreaRepository: CareAreaRepository,
    private readonly serviceChecklistService: ServiceChecklistService,
    private readonly careAreaUtil: CareAreaUtil
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: ICareAreaListFilters
  ): Promise<IPaginationOffsetReturn<CareAreaModel>> {
    const { data, ...others } =
      await this.careAreaRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: ICareAreaListFilters
  ): Promise<IPaginationCursorReturn<CareAreaModel>> {
    const { data, ...others } =
      await this.careAreaRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async getListOffsetWithServiceChecklists(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    vehicleType?: EnumVehicleModelType
  ): Promise<
    IPaginationOffsetReturn<CareAreaModel> & {
      checklistMap: Map<string, any[]>;
    }
  > {
    const { data: careAreas, ...others } =
      await this.careAreaRepository.findWithPaginationOffset(pagination);

    const checklistMap = new Map<string, any[]>();

    for (const careArea of careAreas) {
      const serviceChecklistFind: Record<string, any> = {
        careAreaId: careArea.id,
      };

      if (vehicleType) {
        serviceChecklistFind.vehicleType = vehicleType;
      }

      const { data: serviceChecklists } =
        await this.serviceChecklistService.getListOffset({
          limit: 1000,
          skip: 0,
          where: serviceChecklistFind,
          orderBy: [{ orderBy: EnumPaginationOrderDirectionType.asc }],
        });

      checklistMap.set(careArea.id, serviceChecklists as unknown as any[]);
    }

    return {
      data: careAreas,
      ...others,
      checklistMap,
    };
  }

  async findOneById(id: string): Promise<CareAreaModel> {
    return this.findOneByIdOrFail(id);
  }

  async findOne(
    where: Prisma.CareAreaWhereInput
  ): Promise<CareAreaModel | null> {
    return this.careAreaRepository.findOne(where);
  }

  async create(
    { name, description, orderBy }: CareAreaCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareAreaModel> {
    const created = await this.careAreaRepository.create({
      name,
      description,
      orderBy,
      createdBy: actionBy,
    });

    return created;
  }

  async update(
    id: string,
    { name, description, orderBy }: CareAreaUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareAreaModel> {
    const careArea = await this.findOneByIdOrFail(id);

    const updated = await this.careAreaRepository.update(id, {
      name: name ?? careArea.name,
      description: description ?? careArea.description,
      orderBy: orderBy ?? careArea.orderBy,
      updatedBy: actionBy,
    });

    return updated;
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareAreaModel> {
    await this.findOneByIdOrFail(id);
    const deleted = await this.careAreaRepository.softDelete(id, actionBy);
    return deleted;
  }

  async createMany(
    data: CareAreaCreateRequestDto[],
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<boolean> {
    await Promise.all(
      data.map(item =>
        this.careAreaRepository.create({
          name: item.name,
          description: item.description,
          orderBy: item.orderBy,
          createdBy: actionBy,
        })
      )
    );
    return true;
  }

  // === Trash/Restore ===

  async getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareAreaSelect,
      Prisma.CareAreaWhereInput
    >,
    filters?: ICareAreaListFilters
  ): Promise<IPaginationOffsetReturn<CareAreaModel>> {
    const { data, ...others } =
      await this.careAreaRepository.findWithPaginationOffsetTrashed({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<CareAreaModel> {
    const careArea =
      await this.careAreaRepository.findOneByIdIncludeDeleted(id);

    if (!careArea) {
      throw new NotFoundException({
        statusCode: EnumCareAreaStatusCodeError.notFound,
        message: 'care-area.error.notFound',
      });
    }

    if (!careArea.deletedAt) {
      throw new ConflictException({
        statusCode: EnumCareAreaStatusCodeError.notInTrash,
        message: 'care-area.error.notInTrash',
      });
    }

    const updated = await this.careAreaRepository.restore(id, restoredBy);
    return updated as CareAreaModel;
  }

  async forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<CareAreaModel> {
    const careArea =
      await this.careAreaRepository.findOneByIdIncludeDeleted(id);

    if (!careArea) {
      throw new NotFoundException({
        statusCode: EnumCareAreaStatusCodeError.notFound,
        message: 'care-area.error.notFound',
      });
    }

    if (!careArea.deletedAt) {
      throw new ConflictException({
        statusCode: EnumCareAreaStatusCodeError.notInTrash,
        message: 'care-area.error.notInTrash',
      });
    }

    const deleted = await this.careAreaRepository.forceDelete(id);
    return deleted as CareAreaModel;
  }

  private async findOneByIdOrFail(id: string): Promise<CareAreaModel> {
    const careArea = await this.careAreaRepository.findOneById(id);
    if (!careArea) {
      throw new NotFoundException({
        statusCode: EnumCareAreaStatusCodeError.notFound,
        message: 'care-area.error.notFound',
      });
    }
    return careArea;
  }

  async existByName(name: string): Promise<boolean> {
    const careArea = await this.careAreaRepository.findOne({
      name: {
        equals: name,
        mode: 'insensitive',
      },
    });
    return !!careArea;
  }

  // === Migration helpers ===

  /**
   * Bulk-create care areas for migration seeds.
   * Skips entries that already exist by name.
   * Does not require requestLog or actionBy.
   */
  async createManyForMigration(
    data: ICareAreaMigrationCreate[]
  ): Promise<void> {
    await Promise.all(
      data.map(async item => {
        const exists = await this.careAreaRepository.findOne({
          name: { equals: item.name, mode: 'insensitive' },
        });
        if (!exists) {
          await this.careAreaRepository.create({
            name: item.name,
            description: item.description,
            orderBy: item.orderBy,
          });
        }
      })
    );
  }

  /**
   * Hard-delete all care area records.
   * Intended for use in migration seeds only.
   */
  async deleteMany(): Promise<void> {
    await this.careAreaRepository.deleteMany({});
  }
}
