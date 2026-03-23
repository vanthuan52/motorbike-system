import { Injectable, NotFoundException } from '@nestjs/common';
import { ICareRecordChecklistService } from '../interfaces/care-record-checklist.service.interface';
import { CareRecordChecklistRepository } from '../respository/care-record-checklist.repository';
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
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumCareRecordChecklistStatusCodeError } from '../enums/care-record-checklist.status-code.enum';
import { CareRecordChecklist, Prisma } from '@generated/prisma-client';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';

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
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordChecklist[]; total: number }> {
    const { data, count } =
      await this.careRecordChecklistRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    const careRecordChecklists: CareRecordChecklist[] = data;
    return { data: careRecordChecklists, total: count || 0 };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordChecklistSelect,
      Prisma.CareRecordChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordChecklist[]; total?: number }> {
    const { data, count } =
      await this.careRecordChecklistRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    const careRecordChecklists: CareRecordChecklist[] = data;
    return { data: careRecordChecklists, total: count || 0 };
  }

  async findOneById(id: string): Promise<CareRecordChecklist> {
    return this.findOneByIdOrFail(id);
  }

  async create({
    careRecordService,
    serviceChecklist,
    name,
    wearPercentage,
  }: CareRecordChecklistCreateRequestDto): Promise<DatabaseIdDto> {
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

    return { _id: created.id };
  }

  async createMany(
    dtos: CareRecordChecklistCreateRequestDto[]
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
    }: CareRecordChecklistUpdateRequestDto
  ): Promise<void> {
    const record = await this.findOneByIdOrFail(id);

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (result !== undefined) updateData.result = result;
    if (note !== undefined) updateData.note = note;
    if (wearPercentage !== undefined) updateData.wearPercentage = wearPercentage;

    if (Object.keys(updateData).length > 0) {
      await this.careRecordChecklistRepository.update(id, updateData);
    }
  }

  async updateStatus(
    id: string,
    { status }: CareRecordChecklistUpdateStatusRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.update(id, { status });
  }

  async updateResult(
    id: string,
    { result }: CareRecordChecklistUpdateResultRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.update(id, { result });
  }

  async updateNote(
    id: string,
    { note }: CareRecordChecklistUpdateNoteRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.update(id, { note });
  }

  async updateWearPercentage(
    id: string,
    { wearPercentage }: CareRecordChecklistUpdateWearPercentageRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.update(id, { wearPercentage });
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordChecklistRepository.delete(id);
  }

  private async findOneByIdOrFail(id: string): Promise<CareRecordChecklist> {
    const careRecordChecklist = await this.careRecordChecklistRepository.findOneById(id);

    if (!careRecordChecklist) {
      throw new NotFoundException({
        statusCode: EnumCareRecordChecklistStatusCodeError.notFound,
        message: 'care-record-checklist.error.notFound',
      });
    }

    return careRecordChecklist;
  }
}
