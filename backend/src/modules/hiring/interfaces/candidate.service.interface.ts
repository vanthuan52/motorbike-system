import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { CandidateDoc, CandidateEntity } from '../entities/candidate.entity';
import { CandidateUserCreateRequestDto } from '../dtos/request/candidate.create.request.dto';
import { CandidateListResponseDto } from '../dtos/response/candidate.list.response.dto';
import { CandidateGetResponseDto } from '../dtos/response/candidate.get.response.dto';

export interface ICandidateService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CandidateDoc[]>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CandidateDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CandidateDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: CandidateUserCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CandidateDoc>;
  softDelete(
    repository: CandidateDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CandidateDoc>;

  deleteMany(
    find: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByTitle(
    title: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean>;

  mapList(
    Candidates: CandidateDoc[] | CandidateEntity[],
  ): CandidateListResponseDto[];

  mapGet(Candidate: CandidateDoc | CandidateEntity): CandidateGetResponseDto;
}
