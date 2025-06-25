import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HiringRepository } from '../repository/hiring.repository';
import { IHiringService } from '../interfaces/hiring.service.interface';
import { HiringDoc, HiringEntity } from '../entities/hiring.entity';

import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';

import { HiringCreateRequestDto } from '../dtos/request/hiring.create.request.dto';
import { HiringUpdateRequestDto } from '../dtos/request/hiring.update.request.dto';
import { HiringGetResponseDto } from '../dtos/response/hiring.get.response.dto';
import { HiringListResponseDto } from '../dtos/response/hiring.list.response.dto';

import { HiringUpdateStatusRequestDto } from '../dtos/request/hiring.update-status.request.dto';

@Injectable()
export class HiringService implements IHiringService {
  constructor(private readonly hiringRepository: HiringRepository) {}

  async existByTitle(
    title: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const hiring = await this.hiringRepository.findOne({ title }, options);
    return !!hiring;
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const hiring = await this.hiringRepository.findOne({ slug }, options);
    return !!hiring;
  }

  createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  mapList(hiring: HiringDoc[] | HiringEntity[]): HiringListResponseDto[] {
    return plainToInstance(
      HiringListResponseDto,
      hiring.map((h: HiringDoc | HiringEntity) =>
        typeof (h as any).toObject === 'function' ? (h as any).toObject() : h,
      ),
    );
  }

  mapGet(hiring: HiringDoc | HiringEntity): HiringGetResponseDto {
    return plainToInstance(
      HiringGetResponseDto,
      typeof (hiring as any).toObject === 'function'
        ? (hiring as any).toObject()
        : hiring,
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<HiringDoc[]> {
    return this.hiringRepository.findAll(find, options);
  }

  async findAllPublished(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<HiringDoc[]> {
    return this.hiringRepository.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<HiringDoc | null> {
    return this.hiringRepository.findOne({ _id }, options);
  }

  async join(repository: HiringDoc): Promise<HiringDoc> {
    return this.hiringRepository.join(
      repository,
      this.hiringRepository._joinActive!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<HiringDoc | null> {
    return this.hiringRepository.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.hiringRepository.getTotal(find, options);
  }

  async create(
    payload: HiringCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<HiringDoc> {
    const create: HiringEntity = new HiringEntity();
    create.title = payload.title;
    create.slug = payload.slug;
    create.description = payload.description;
    create.requirements = payload.requirements;
    create.location = payload.location;
    create.salaryRange = payload.salaryRange;
    create.applicationDeadline = payload.applicationDeadline;
    create.category = payload.category;
    create.jobType = payload.jobType;
    return this.hiringRepository.create(create, options);
  }

  async update(
    repository: HiringDoc,
    payload: HiringUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<HiringDoc> {
    repository.title = payload.title ?? repository.title;
    repository.slug = payload.slug ?? repository.slug;
    repository.description = payload.description ?? repository.description;
    repository.requirements = payload.requirements ?? repository.requirements;
    repository.location = payload.location ?? repository.location;
    repository.salaryRange = payload.salaryRange ?? repository.salaryRange;
    repository.applicationDeadline =
      payload.applicationDeadline ?? repository.applicationDeadline;
    repository.category = payload.category ?? repository.category;
    repository.jobType = payload.jobType ?? repository.jobType;
    return this.hiringRepository.save(repository, options);
  }

  async softDelete(
    repository: HiringDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<HiringDoc> {
    return this.hiringRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.hiringRepository.deleteMany(find, options);
    return true;
  }

  async updateStatus(
    repository: HiringDoc,
    { status }: HiringUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<HiringDoc> {
    repository.status = status;

    return this.hiringRepository.save(repository, options);
  }
  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<HiringDoc[]> {
    return this.hiringRepository.findAll(find, options);
  }

  async findBySlug(slug: string): Promise<HiringDoc | null> {
    return this.hiringRepository.findOneBySlug(slug);
  }
}
