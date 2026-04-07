import { Injectable, NotFoundException } from '@nestjs/common';
import { ICareRecordChecklistService } from '../interfaces/care-record-checklist.service.interface';
import { CareRecordChecklistRepository } from '../repository/care-record-checklist.repository';
import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import {
  EnumCareRecordChecklistResult,
  EnumCareRecordChecklistStatus,
} from '../enums/care-record-checklist.enum';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateNoteRequestDto } from '../dtos/request/care-record-checklist.update-note.request.dto';
import { CareRecordChecklistUpdateWearPercentageRequestDto } from '../dtos/request/care-record-checklist.update-wear-percentage.request.dto';
import { CareRecordChecklistUpdateResultRequestDto } from '../dtos/request/care-record-checklist.update-result.request.dto';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumCareRecordChecklistStatusCodeError } from '../enums/care-record-checklist.status-code.enum';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { Prisma } from '@/generated/prisma-client';
import { CareRecordChecklistModel } from '../models/care-record-checklist.model';

import { ICareRecordChecklistListFilters } from '../interfaces/care-record-checklist.filter.interface';

@Injectable()
export class CareRecordChecklistService implements ICareRecordChecklistService {
  constructor(
    private readonly careRecordChecklistRepository: CareRecordChecklistRepository
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordChecklistSelect,
      Prisma.CareRecordChecklistWhereInput
    >,
    filters?: ICareRecordChecklistListFilters
  ): Promise<IPaginationOffsetReturn<CareRecordChecklistModel>> {
    const { data, ...others } =
      await this.careRecordChecklistRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordChecklistSelect,
      Prisma.CareRecordChecklistWhereInput
    >,
    filters?: ICareRecordChecklistListFilters
  ): Promise<IPaginationCursorReturn<CareRecordChecklistModel>> {
    const { data, ...others } =
      await this.careRecordChecklistRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async findOneById(id: string): Promise<CareRecordChecklistModel> {
    return this.findOneByIdOrFail(id);
  }

  async create(
    {
      careRecordService,
      serviceChecklist,
      name,
      wearPercentage,
    }: CareRecordChecklistCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<DatabaseIdDto> {
    const created = await this.careRecordChecklistRepository.create({
      name,
      wearPercentage: wearPercentage ?? undefined,
      result: EnumCareRecordChecklistResult.unchecked,
      status: EnumCareRecordChecklistStatus.pending,
      careRecordService: {
        connect: { id: careRecordService },
      },
      ...(serviceChecklist && {
        serviceChecklist: {
          connect: { id: serviceChecklist },
        },
      }),
    });

    return { id: created.id };
  }

  async createMany(
    dtos: CareRecordChecklistCreateRequestDto[],
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<boolean> {
    await Promise.all(
      dtos.map(dto =>
        this.careRecordChecklistRepository.create({
          name: dto.name,
          wearPercentage: dto.wearPercentage ?? undefined,
          result: EnumCareRecordChecklistResult.unchecked,
          status: EnumCareRecordChecklistStatus.pending,
          careRecordService: {
            connect: { id: dto.careRecordService },
          },
          ...(dto.serviceChecklist && {
            serviceChecklist: {
              connect: { id: dto.serviceChecklist },
            },
          }),
        })
      )
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
    }: CareRecordChecklistUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    const record = await this.findOneByIdOrFail(id);

    const updateData: any = {};
    if (status !== undefined) {
      updateData.status = status;
    }
    if (result !== undefined) {
      updateData.result = result;
    }
    if (note !== undefined) {
      updateData.note = note;
    }
    if (wearPercentage !== undefined) {
      updateData.wearPercentage = wearPercentage;
    }

    if (Object.keys(updateData).length > 0) {
      await this.careRecordChecklistRepository.update(id, updateData);
    }
  }

  async updateStatus(
    id: string,
    { status }: CareRecordChecklistUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.update(id, { status });
  }

  async updateResult(
    id: string,
    { result }: CareRecordChecklistUpdateResultRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.update(id, { result });
  }

  async updateNote(
    id: string,
    { note }: CareRecordChecklistUpdateNoteRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.update(id, { note });
  }

  async updateWearPercentage(
    id: string,
    { wearPercentage }: CareRecordChecklistUpdateWearPercentageRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.update(id, { wearPercentage });
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.softDelete(id);
  }

  async restore(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.restore(id);
  }

  async forceDelete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.forceDelete(id);
  }

  async deleteMany(
    find: Record<string, any>,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<boolean> {
    await this.careRecordChecklistRepository.deleteMany(find);
    return true;
  }

  private async findOneByIdOrFail(
    id: string
  ): Promise<CareRecordChecklistModel> {
    const careRecordChecklist =
      await this.careRecordChecklistRepository.findOneById(id);

    if (!careRecordChecklist) {
      throw new NotFoundException({
        statusCode: EnumCareRecordChecklistStatusCodeError.notFound,
        message: 'care-record-checklist.error.notFound',
      });
    }

    return careRecordChecklist;
  }
}
