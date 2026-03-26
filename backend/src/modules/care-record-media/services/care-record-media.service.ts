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
import { CareRecordMedia, Prisma } from '@generated/prisma-client';

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
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareRecordMedia>> {
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
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<CareRecordMedia>> {
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

  async findOneById(id: string): Promise<CareRecordMedia> {
    return this.findOneByIdOrFail(id);
  }

  async create({
    careRecord,
    stage,
    type,
    url,
    description,
  }: CareRecordMediaCreateRequestDto): Promise<DatabaseIdDto> {
    const created = await this.careRecordMediaRepository.create({
      careRecord: { connect: { id: careRecord } },
      stage,
      type,
      url: url ?? undefined,
      description: description ?? undefined,
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
    }: CareRecordMediaUpdateRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);

    const updateData: any = {};
    if (careRecord !== undefined)
      updateData.careRecord = { connect: { id: careRecord } };
    if (stage !== undefined) updateData.stage = stage;
    if (type !== undefined) updateData.type = type;
    if (url !== undefined) updateData.url = url;
    if (description !== undefined) updateData.description = description;

    await this.careRecordMediaRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordMediaRepository.delete(id);
  }

  async deleteMany(find?: Record<string, any>): Promise<boolean> {
    return true;
  }

  private async findOneByIdOrFail(id: string): Promise<CareRecordMedia> {
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
