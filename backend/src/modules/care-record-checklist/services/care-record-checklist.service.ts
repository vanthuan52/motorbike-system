import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ICareRecordChecklistService } from '../interfaces/care-record-checklist.service.interface';
import { CareRecordChecklistRepository } from '../respository/care-record-checklist.repository';
import {
  CareRecordChecklistDoc,
  CareRecordChecklistEntity,
} from '../entities/care-record-checklist.entity';
import { ICareRecordChecklistEntity } from '../interfaces/care-record-checklist.interface';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistDto } from '../dtos/care-record-checklist.dto';
import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import {
  ENUM_CARE_RECORD_CHECKLIST_RESULT,
  ENUM_CARE_RECORD_CHECKLIST_STATUS,
} from '../enums/care-record-checklist.enum';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateNoteRequestDto } from '../dtos/request/care-record-checklist.update-note.request.dto';
import { CareRecordChecklistUpdateWearPercentageRequestDto } from '../dtos/request/care-record-checklist.update-wear-percentage.request.dto';
import { CareRecordChecklistUpdateResultRequestDto } from '../dtos/request/care-record-checklist.update-result.request.dto';
import { CareRecordChecklistUtil } from '../utils/care-record-checklist.util';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { ENUM_CARE_RECORD_CHECKLIST_STATUS_CODE_ERROR } from '../enums/care-record-checklist.status-code.enum';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';

@Injectable()
export class CareRecordChecklistService implements ICareRecordChecklistService {
  constructor(
    private readonly careRecordChecklistRepository: CareRecordChecklistRepository,
    private readonly careRecordChecklistUtil: CareRecordChecklistUtil,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<IResponsePagingReturn<CareRecordChecklistListResponseDto>> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [careRecordChecklists, total] = await Promise.all([
      this.careRecordChecklistRepository.findAll<ICareRecordChecklistEntity>(
        find,
        {
          paging: { limit, offset: skip },
          order: orderBy,
          join: true,
        },
      ),
      this.careRecordChecklistRepository.getTotal(find),
    ]);

    const mapped = this.careRecordChecklistUtil.mapList(careRecordChecklists);
    const totalPage = Math.ceil(total / limit);
    const page = Math.floor(skip / limit) + 1;
    const hasNext = page < totalPage;
    const hasPrevious = page > 1;

    return {
      type: EnumPaginationType.offset,
      count: total,
      perPage: limit,
      page,
      totalPage,
      hasNext,
      hasPrevious,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: hasPrevious ? page - 1 : undefined,
      data: mapped,
    };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IResponseReturn<CareRecordChecklistGetFullResponseDto>> {
    const careRecordChecklist = await this.findOneByIdOrFail(id, {
      ...options,
      join: true,
    });
    return {
      data: this.careRecordChecklistUtil.mapGetFull(careRecordChecklist),
    };
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<IResponseReturn<CareRecordChecklistGetFullResponseDto>> {
    const careRecordChecklist =
      await this.careRecordChecklistRepository.findOne<CareRecordChecklistDoc>(
        find,
        options,
      );
    return {
      data: this.careRecordChecklistUtil.mapGetFull(careRecordChecklist),
    };
  }

  async create(
    {
      careRecordService,
      serviceChecklist,
      name,
      wearPercentage,
    }: CareRecordChecklistCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<IResponseReturn<{ _id: string }>> {
    const create: CareRecordChecklistEntity = new CareRecordChecklistEntity();

    create.careRecordService = careRecordService;
    create.serviceChecklist = serviceChecklist;
    create.name = name;
    create.wearPercentage = wearPercentage;
    create.result = ENUM_CARE_RECORD_CHECKLIST_RESULT.UNCHECKED;
    create.status = ENUM_CARE_RECORD_CHECKLIST_STATUS.PENDING;

    const created =
      await this.careRecordChecklistRepository.create<CareRecordChecklistEntity>(
        create,
        options,
      );

    return { data: { _id: created._id } };
  }

  async createMany(
    dtos: CareRecordChecklistCreateRequestDto[],
    options?: IDatabaseCreateOptions,
  ): Promise<boolean> {
    const entities = dtos.map((dto) => {
      const create: CareRecordChecklistEntity = new CareRecordChecklistEntity();
      create.careRecordService = dto.careRecordService;
      create.serviceChecklist = dto.serviceChecklist;
      create.name = dto.name;
      create.wearPercentage = dto.wearPercentage;
      create.result = ENUM_CARE_RECORD_CHECKLIST_RESULT.UNCHECKED;
      create.status = ENUM_CARE_RECORD_CHECKLIST_STATUS.PENDING;
      return create;
    });

    await this.careRecordChecklistRepository.createMany<CareRecordChecklistEntity>(
      entities,
      options,
    );

    return true;
  }

  async update(
    id: string,
    {
      status,
      result,
      note,
      wearPercentage,
      parts,
    }: CareRecordChecklistUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>> {
    const repository = await this.findOneByIdOrFail(id);
    repository.status =
      (status as ENUM_CARE_RECORD_CHECKLIST_STATUS) ?? repository.status;
    repository.result =
      (result as ENUM_CARE_RECORD_CHECKLIST_RESULT) ?? repository.result;
    repository.note = note ?? repository.note;
    repository.wearPercentage = wearPercentage ?? repository.wearPercentage;
    repository.parts = parts ?? repository.parts;

    await this.careRecordChecklistRepository.save(repository, options);
    return {};
  }

  async updateStatus(
    id: string,
    { status }: CareRecordChecklistUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>> {
    const repository = await this.findOneByIdOrFail(id);
    repository.status = status;

    await this.careRecordChecklistRepository.save(repository, options);
    return {
      metadata: {
        messageProperties: {
          status: status.toLowerCase(),
        },
      },
    };
  }

  async updateResult(
    id: string,
    { result }: CareRecordChecklistUpdateResultRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>> {
    const repository = await this.findOneByIdOrFail(id);
    repository.result = result;

    await this.careRecordChecklistRepository.save(repository, options);
    return {
      metadata: {
        messageProperties: {
          result: result.toLowerCase(),
        },
      },
    };
  }

  async updateNote(
    id: string,
    { note }: CareRecordChecklistUpdateNoteRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>> {
    const repository = await this.findOneByIdOrFail(id);
    repository.note = note;

    await this.careRecordChecklistRepository.save(repository, options);
    return {};
  }

  async updateWearPercentage(
    id: string,
    { wearPercentage }: CareRecordChecklistUpdateWearPercentageRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>> {
    const repository = await this.findOneByIdOrFail(id);
    repository.wearPercentage = wearPercentage;

    await this.careRecordChecklistRepository.save(repository, options);
    return {};
  }

  async delete(
    id: string,
    options?: IDatabaseSaveOptions,
  ): Promise<IResponseReturn<void>> {
    const repository = await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.softDelete(repository, options);
    return {};
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordChecklistRepository.deleteMany(find, options);
    return true;
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordChecklistDoc> {
    const careRecordChecklist =
      await this.careRecordChecklistRepository.findOneById<CareRecordChecklistDoc>(
        id,
        options,
      );
    if (!careRecordChecklist) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_CHECKLIST_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-checklist.error.notFound',
      });
    }
    return careRecordChecklist;
  }
}
