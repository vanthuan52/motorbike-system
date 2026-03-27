import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { HiringRepository } from '../repository/hiring.repository';
import { IHiringService } from '../interfaces/hiring.service.interface';
import { HiringCreateRequestDto } from '../dtos/request/hiring.create.request.dto';
import { HiringUpdateRequestDto } from '../dtos/request/hiring.update.request.dto';
import { HiringUpdateStatusRequestDto } from '../dtos/request/hiring.update-status.request.dto';
import { Hiring, Prisma } from '@/generated/prisma-client';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumHiringStatusCodeError } from '../enums/hiring.status-code.enum';
import { EnumHiringStatus } from '../enums/hiring.enum';

@Injectable()
export class HiringService implements IHiringService {
  constructor(private readonly hiringRepository: HiringRepository) {}

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<Hiring>> {
    return this.hiringRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<Hiring>> {
    return this.hiringRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async findOneById(id: string): Promise<Hiring | null> {
    return this.hiringRepository.findOneById(id);
  }

  async findOne(where: Prisma.HiringWhereInput): Promise<Hiring | null> {
    return this.hiringRepository.findOne(where);
  }

  async create(payload: HiringCreateRequestDto): Promise<DatabaseIdDto> {
    const created = await this.hiringRepository.create({
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      requirements: payload.requirements,
      location: payload.location,
      salaryRange: payload.salaryRange,
      applicationDeadline: new Date(payload.applicationDeadline),
      category: payload.category,
      jobType: payload.jobType as any,
      status: EnumHiringStatus.draft as any,
    });

    return { id: created.id };
  }

  async update(id: string, payload: HiringUpdateRequestDto): Promise<void> {
    await this.findOneByIdOrFail(id);

    const updateData: Prisma.HiringUpdateInput = {};
    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.slug !== undefined) updateData.slug = payload.slug;
    if (payload.description !== undefined)
      updateData.description = payload.description;
    if (payload.requirements !== undefined)
      updateData.requirements = payload.requirements;
    if (payload.location !== undefined) updateData.location = payload.location;
    if (payload.salaryRange !== undefined)
      updateData.salaryRange = payload.salaryRange;
    if (payload.applicationDeadline !== undefined)
      updateData.applicationDeadline = new Date(payload.applicationDeadline);
    if (payload.category !== undefined) updateData.category = payload.category;
    if (payload.jobType !== undefined) updateData.jobType = payload.jobType as any;

    if (Object.keys(updateData).length > 0) {
      await this.hiringRepository.update(id, updateData);
    }
  }

  async updateStatus(
    id: string,
    { status }: HiringUpdateStatusRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.hiringRepository.update(id, { status: status as any });
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.hiringRepository.delete(id);
  }

  private async findOneByIdOrFail(id: string): Promise<Hiring> {
    const hiring = await this.hiringRepository.findOneById(id);

    if (!hiring) {
      throw new NotFoundException({
        statusCode: EnumHiringStatusCodeError.notFound,
        message: 'hiring.error.notFound',
      });
    }

    return hiring;
  }
}
