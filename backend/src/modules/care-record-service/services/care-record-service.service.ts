import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ICareRecordServiceService } from '../interfaces/care-record-service.service.interface';
import { CareRecordServiceRepository } from '../repository/care-record-service.repository';
import {
  CareRecordServiceDoc,
  CareRecordServiceEntity,
} from '../entities/care-record-service.entity';
import { ICareRecordServiceEntity } from '../interfaces/care-record-service.interface';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import { ENUM_CARE_RECORD_SERVICE_STATUS } from '../enums/care-record-service.enum';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordChecklistService } from '@/modules/care-record-checklist/services/care-record-checklist.service';
import { CareRecordServiceUtil } from '../utils/care-record-service.util';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import { ENUM_CARE_RECORD_SERVICE_STATUS_CODE_ERROR } from '../enums/care-record-service.status-code.enum';
import { CareRecordChecklistDoc } from '@/modules/care-record-checklist/entities/care-record-checklist.entity';

@Injectable()
export class CareRecordServiceService implements ICareRecordServiceService {
  constructor(
    private readonly careRecordServiceRepository: CareRecordServiceRepository,
    private readonly careRecordChecklistService: CareRecordChecklistService,
    private readonly careRecordServiceUtil: CareRecordServiceUtil,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordServiceDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [careRecordServices, total] = await Promise.all([
      this.careRecordServiceRepository.findAll<ICareRecordServiceEntity>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: true,
      }),
      this.careRecordServiceRepository.getTotal(find),
    ]);

    return {
      data: careRecordServices,
      total,
    };
  }

  async getListOffsetWithChecklists(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{
    data: {
      service: CareRecordServiceDoc;
      checklists: CareRecordChecklistDoc[];
    }[];
    total: number;
  }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [careRecordServices, total] = await Promise.all([
      this.careRecordServiceRepository.findAll<CareRecordServiceDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.careRecordServiceRepository.getTotal(find),
    ]);

    const result: {
      service: CareRecordServiceDoc;
      checklists: CareRecordChecklistDoc[];
    }[] = [];

    for (const careRecordService of careRecordServices) {
      const checklistFind: Record<string, any> = {
        careRecordService: careRecordService._id,
      };

      const checklistResponse =
        await this.careRecordChecklistService.getListOffset({
          limit: 100,
          skip: 0,
          where: checklistFind,
          orderBy: { createdAt: EnumPaginationOrderDirectionType.desc },
        });

      result.push({
        service: careRecordService,
        checklists: checklistResponse.data,
      });
    }

    return {
      data: result,
      total,
    };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordServiceDoc> {
    const careRecordService = await this.findOneByIdOrFail(id, {
      ...options,
      join: true,
    });
    return careRecordService;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordServiceDoc> {
    const careRecordService =
      await this.careRecordServiceRepository.findOne<CareRecordServiceDoc>(
        find,
        options,
      );
    return careRecordService;
  }

  async create(
    {
      careRecord,
      name,
      vehicleService,
      type,
    }: CareRecordServiceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordServiceDoc> {
    const create: CareRecordServiceEntity = new CareRecordServiceEntity();

    create.careRecord = careRecord;
    create.name = name;
    create.vehicleService = vehicleService;
    create.type = type;
    create.status = ENUM_CARE_RECORD_SERVICE_STATUS.PENDING;

    const created =
      await this.careRecordServiceRepository.create<CareRecordServiceEntity>(
        create,
        options,
      );

    return created;
  }

  async createMany(
    dtos: CareRecordServiceCreateRequestDto[],
    options?: IDatabaseCreateOptions,
  ): Promise<boolean> {
    const entities = dtos.map((dto) => {
      const create: CareRecordServiceEntity = new CareRecordServiceEntity();
      create.careRecord = dto.careRecord;
      create.name = dto.name;
      create.vehicleService = dto.vehicleService;
      create.type = dto.type;
      create.status = ENUM_CARE_RECORD_SERVICE_STATUS.PENDING;
      return create;
    });

    await this.careRecordServiceRepository.createMany<CareRecordServiceEntity>(
      entities,
      options,
    );

    return true;
  }

  async update(
    id: string,
    payload: CareRecordServiceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    // Update fields if needed in future
    await this.careRecordServiceRepository.save(repository, options);
    return;
  }

  async updateStatus(
    id: string,
    { status }: CareRecordServiceUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.status = status;

    await this.careRecordServiceRepository.save(repository, options);
    return;
  }

  async delete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.careRecordServiceRepository.softDelete(repository, options);
    return;
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordServiceRepository.deleteMany(find, options);
    return true;
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordServiceDoc> {
    const careRecordService =
      await this.careRecordServiceRepository.findOneById<CareRecordServiceDoc>(
        id,
        options,
      );
    if (!careRecordService) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-service.error.notFound',
      });
    }
    return careRecordService;
  }
}
