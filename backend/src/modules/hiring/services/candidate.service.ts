import { Injectable, NotFoundException } from '@nestjs/common';
import { CandidateRepository } from '../repository/candidate.repository';
import { ICandidateService } from '../interfaces/candidate.service.interface';
import { CandidateUserCreateRequestDto } from '../dtos/request/candidate.create.request.dto';
import { CandidateUpdateStatusRequestDto } from '../dtos/request/candidate.update-status.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumHiringStatusCodeError } from '../enums/hiring.status-code.enum';
import { CandidateModel } from '../models/candidate.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class CandidateService implements ICandidateService {
  constructor(private readonly candidateRepository: CandidateRepository) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CandidateSelect,
      Prisma.CandidateWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<CandidateModel>> {
    return this.candidateRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CandidateSelect,
      Prisma.CandidateWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<CandidateModel>> {
    return this.candidateRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async findOneById(id: string): Promise<CandidateModel | null> {
    return this.candidateRepository.findOneById(id);
  }

  async findOne(
    where: Prisma.CandidateWhereInput
  ): Promise<CandidateModel | null> {
    return this.candidateRepository.findOne(where);
  }

  async create(payload: CandidateUserCreateRequestDto): Promise<DatabaseIdDto> {
    const created = await this.candidateRepository.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      appliedAt: payload.appliedAt,
      cv: payload.cv,
      experience: payload.experience,
      education: payload.education,
      hiring: {
        connect: { id: payload.hiring },
      },
    });

    return { id: created.id };
  }

  async updateStatus(
    id: string,
    { status }: CandidateUpdateStatusRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.candidateRepository.update(id, { status: status as any });
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.candidateRepository.delete(id);
  }

  private async findOneByIdOrFail(id: string): Promise<CandidateModel> {
    const candidate = await this.candidateRepository.findOneById(id);

    if (!candidate) {
      throw new NotFoundException({
        statusCode: EnumHiringStatusCodeError.notFound,
        message: 'candidate.error.notFound',
      });
    }

    return candidate;
  }
}
