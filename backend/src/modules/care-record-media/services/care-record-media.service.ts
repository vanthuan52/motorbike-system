import { Injectable, NotFoundException } from '@nestjs/common';
import { ICareRecordMediaService } from '../interfaces/care-record-media.service.interface';
import { CareRecordMediaRepository } from '../respository/care-record-media.repository';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { CareRecordMediaModel } from '../models/care-record-media.model';
import { Prisma } from '@generated/prisma-client';

import { ICareRecordMediaListFilters } from '../interfaces/care-record-media.filter.interface';

@Injectable()
export class CareRecordMediaService implements ICareRecordMediaService {
  constructor(
    private readonly careRecordMediaRepository: CareRecordMediaRepository
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordMediaSelect,
      Prisma.CareRecordMediaWhereInput
    >,
    filters?: ICareRecordMediaListFilters
  ): Promise<IPaginationOffsetReturn<CareRecordMediaModel>> {
    const { data, ...others } =
      await this.careRecordMediaRepository.findWithPaginationOffset({
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
      Prisma.CareRecordMediaSelect,
      Prisma.CareRecordMediaWhereInput
    >,
    filters?: ICareRecordMediaListFilters
  ): Promise<IPaginationCursorReturn<CareRecordMediaModel>> {
    const { data, ...others } =
      await this.careRecordMediaRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async findOneById(id: string): Promise<CareRecordMediaModel> {
    return this.findOneByIdOrFail(id);
  }

  async create(
    {
      careRecord,
      stage,
      type,
      url,
      description,
    }: CareRecordMediaCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<DatabaseIdDto> {
    const created = await this.careRecordMediaRepository.create({
      careRecord: { connect: { id: careRecord } },
      stage,
      type,
      url: url ?? undefined,
      description: description ?? undefined,
      createdBy: actionBy,
    });

    return { id: created.id };
  }

  async update(
    id: string,
    {
      careRecord,
      stage,
      type,
      url,
      description,
    }: CareRecordMediaUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);

    const updateData: any = {
      updatedBy: actionBy,
    };
    if (careRecord !== undefined)
      updateData.careRecord = { connect: { id: careRecord } };
    if (stage !== undefined) updateData.stage = stage;
    if (type !== undefined) updateData.type = type;
    if (url !== undefined) updateData.url = url;
    if (description !== undefined) updateData.description = description;

    await this.careRecordMediaRepository.update(id, updateData);
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordMediaRepository.update(id, {
      deletedBy: actionBy,
      deletedAt: new Date(),
    });
  }

  async deleteMany(find?: Record<string, any>): Promise<boolean> {
    return true;
  }

  private async findOneByIdOrFail(id: string): Promise<CareRecordMediaModel> {
    const careRecordMedia =
      await this.careRecordMediaRepository.findOneById(id);
    if (!careRecordMedia) {
      throw new NotFoundException({
        statusCode: 'NOT_FOUND',
        message: 'care-record-media.error.notFound',
      });
    }
    return careRecordMedia;
  }
}
