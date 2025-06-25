import { Injectable } from '@nestjs/common';
import { ICandidateService } from '../interfaces/candidate.service.interface';
import { CandidateRepository } from '../repository/candidate.repository';
import {
  IDatabaseFindAllOptions,
  IDatabaseOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
} from '@/common/database/interfaces/database.interface';
import { CandidateUserCreateRequestDto } from '../dtos/request/candidate.create.request.dto';
import { CandidateGetResponseDto } from '../dtos/response/candidate.get.response.dto';
import { CandidateListResponseDto } from '../dtos/response/candidate.list.response.dto';
import { CandidateDoc, CandidateEntity } from '../entities/candidate.entity';
import { plainToInstance } from 'class-transformer';
import { CandidateUpdateStatusRequestDto } from '../dtos/request/candidate.update-status.request.dto';

@Injectable()
export class CandidateService implements ICandidateService {
  constructor(private readonly candidateRepository: CandidateRepository) {}
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CandidateDoc[]> {
    return this.candidateRepository.findAll(find, options);
  }
  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CandidateDoc | null> {
    return this.candidateRepository.findOneById(_id, options);
  }
  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CandidateDoc | null> {
    return this.candidateRepository.findOne(find, options);
  }
  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.candidateRepository.getTotal(find, options);
  }
  create(
    payload: CandidateUserCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CandidateDoc> {
    const create: CandidateEntity = new CandidateEntity();
    create.hiring = payload.hiring?.toString();
    create.name = payload.name;
    create.email = payload.email;
    create.phone = payload.phone;
    create.appliedAt = payload.appliedAt;
    create.cv = payload.cv;
    create.experience = payload.experience;
    create.education = payload.education;
    return this.candidateRepository.create(create, options);
  }
  softDelete(
    repository: CandidateDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CandidateDoc> {
    return this.candidateRepository.softDelete(repository, options);
  }
  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    this.candidateRepository.deleteMany(find, options);
    return true;
  }
  async existByTitle(
    title: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const candidate = await this.candidateRepository.findOne(
      { title },
      options,
    );
    return !!candidate;
  }
  mapList(
    candidates: CandidateDoc[] | CandidateEntity[],
  ): CandidateListResponseDto[] {
    return plainToInstance(
      CandidateListResponseDto,
      candidates.map((e: CandidateDoc | CandidateEntity) =>
        typeof (e as any).toObject === 'function' ? (e as any).toObject() : e,
      ),
    );
  }
  mapGet(candidate: CandidateDoc | CandidateEntity): CandidateGetResponseDto {
    return plainToInstance(
      CandidateGetResponseDto,
      typeof (candidate as any).toObject === 'function'
        ? (candidate as any).toObject()
        : candidate,
    );
  }

  async updateStatus(
    repository: CandidateDoc,
    { status }: CandidateUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CandidateDoc> {
    repository.status = status;
    return this.candidateRepository.save(repository, options);
  }
}
