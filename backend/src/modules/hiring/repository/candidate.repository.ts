import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { CandidateModel } from '../models/candidate.model';
import { CandidateMapper } from '../mappers/candidate.mapper';
import {
  Candidate as PrismaCandidate,
  Prisma,
} from '@/generated/prisma-client';

@Injectable()
export class CandidateRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.CandidateSelect,
      Prisma.CandidateWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<CandidateModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaCandidate,
      Prisma.CandidateSelect,
      Prisma.CandidateWhereInput
    >(this.databaseService.candidate, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: {
        hiring: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CandidateMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.CandidateSelect,
      Prisma.CandidateWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<CandidateModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaCandidate,
      Prisma.CandidateSelect,
      Prisma.CandidateWhereInput
    >(this.databaseService.candidate, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: {
        hiring: true,
      },
      includeCount: true,
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => CandidateMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<CandidateModel | null> {
    const result = await this.databaseService.candidate.findUnique({
      where: { id },
      include: {
        hiring: true,
      },
    });
    return result ? CandidateMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CandidateWhereInput
  ): Promise<CandidateModel | null> {
    const result = await this.databaseService.candidate.findFirst({
      where,
      include: {
        hiring: true,
      },
    });
    return result ? CandidateMapper.toDomain(result) : null;
  }

  async create(data: Prisma.CandidateCreateInput): Promise<CandidateModel> {
    const result = await this.databaseService.candidate.create({
      data,
      include: {
        hiring: true,
      },
    });
    return CandidateMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CandidateUpdateInput
  ): Promise<CandidateModel> {
    const result = await this.databaseService.candidate.update({
      where: { id },
      data,
      include: {
        hiring: true,
      },
    });
    return CandidateMapper.toDomain(result);
  }

  async delete(id: string): Promise<CandidateModel> {
    const result = await this.databaseService.candidate.delete({
      where: { id },
    });
    return CandidateMapper.toDomain(result);
  }

  async getTotal(where: Prisma.CandidateWhereInput): Promise<number> {
    return this.databaseService.candidate.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }
}
