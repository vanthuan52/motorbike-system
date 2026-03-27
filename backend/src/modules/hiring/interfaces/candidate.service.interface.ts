import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CandidateUserCreateRequestDto } from '../dtos/request/candidate.create.request.dto';
import { CandidateUpdateStatusRequestDto } from '../dtos/request/candidate.update-status.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CandidateModel } from '../models/candidate.model';
import { Prisma } from '@/generated/prisma-client';
export interface ICandidateService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CandidateSelect,
      Prisma.CandidateWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<CandidateModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CandidateSelect,
      Prisma.CandidateWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<CandidateModel>>;

  findOneById(id: string): Promise<CandidateModel | null>;

  findOne(where: Prisma.CandidateWhereInput): Promise<CandidateModel | null>;

  create(payload: CandidateUserCreateRequestDto): Promise<DatabaseIdDto>;

  updateStatus(
    id: string,
    payload: CandidateUpdateStatusRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;
}
