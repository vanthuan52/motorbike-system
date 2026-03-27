import { Injectable, NotFoundException } from '@nestjs/common';
import { CareAreaRepository } from '../repository/care-area.repository';
import { ICareAreaService } from '../interfaces/care-area.service.interface';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
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
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { CareAreaModel } from '../models/care-area.model';
import { Prisma } from '@/generated/prisma-client';

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
    filters?: Record<string, any>
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
    filters?: Record<string, any>
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
  ): Promise<IResponseReturn<{ id: string }>> {
    const created = await this.careAreaRepository.create({
      name,
      description,
      orderBy,
    });

    return {
      data: { id: created.id },
      metadataActivityLog: this.careAreaUtil.mapActivityLogMetadata(created),
    };
  }

  async update(
    id: string,
    { name, description, orderBy }: CareAreaUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<IResponseReturn<void>> {
    const careArea = await this.findOneByIdOrFail(id);

    const updated = await this.careAreaRepository.update(id, {
      name: name ?? careArea.name,
      description: description ?? careArea.description,
      orderBy: orderBy ?? (careArea.orderBy as string),
    });

    return {
      metadataActivityLog: this.careAreaUtil.mapActivityLogMetadata(updated),
    };
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<IResponseReturn<void>> {
    await this.findOneByIdOrFail(id);
    const deleted = await this.careAreaRepository.delete(id);
    return {
      metadataActivityLog: this.careAreaUtil.mapActivityLogMetadata(deleted),
    };
  }

  async createMany(
    data: CareAreaCreateRequestDto[],
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<IResponseReturn<boolean>> {
    await Promise.all(
      data.map(item =>
        this.careAreaRepository.create({
          name: item.name,
          description: item.description,
          orderBy: item.orderBy,
        })
      )
    );
    return { data: true };
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
}
