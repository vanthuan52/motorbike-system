import { Injectable } from '@nestjs/common';
import { PopulateOptions } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { StoreDoc, StoreEntity } from '../entities/store.entity';
import { StoreGetResponseDto } from '../dtos/response/store.get.response.dto';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';
import { StoreRepository } from '../repository/store.repository';
import { IStoreService } from '../interfaces/store.service.interface';

@Injectable()
export class StoreService implements IStoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async existsByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const store = await this.storeRepository.findOne({ name }, options);
    return !!store;
  }

  async existsBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const store = await this.storeRepository.findOne({ slug }, options);
    return !!store;
  }

  createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  mapList(store: StoreDoc[] | StoreEntity[]): StoreListResponseDto[] {
    return plainToInstance(
      StoreListResponseDto,
      store.map((s: StoreDoc | StoreEntity) =>
        typeof (s as any).toObject === 'function' ? (s as any).toObject() : s,
      ),
    );
  }

  mapGet(store: StoreDoc | StoreEntity): StoreGetResponseDto {
    return plainToInstance(
      StoreGetResponseDto,
      typeof (store as any).toObject === 'function'
        ? (store as any).toObject()
        : store,
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<StoreDoc[]> {
    return this.storeRepository.findAll(find, options);
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<StoreDoc[]> {
    return this.storeRepository.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<StoreDoc | null> {
    return this.storeRepository.findOne({ _id }, options);
  }

  async join(repository: StoreDoc): Promise<StoreDoc> {
    return this.storeRepository.join(
      repository,
      this.storeRepository._joinActive! as (string | PopulateOptions)[],
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<StoreDoc | null> {
    return this.storeRepository.findOne(find, options);
  }

  async getTotal(
    find: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<number> {
    return this.storeRepository.getTotal(find, options);
  }

  async create(
    payload: StoreCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<StoreDoc> {
    const create: StoreEntity = new StoreEntity();
    create.name = payload.name;
    create.address = payload.address;
    create.workHours = payload.workHours;
    create.slug = payload.slug ?? this.createSlug(payload.name);
    return this.storeRepository.create(create, options);
  }

  async update(
    repository: StoreDoc,
    payload: StoreUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<StoreDoc> {
    repository.name = payload.name ?? repository.name;
    repository.address = payload.address ?? repository.address;
    repository.workHours = payload.workHours ?? repository.workHours;
    repository.slug = payload.slug ?? repository.slug;
    return this.storeRepository.save(repository, options);
  }

  async softDelete(
    repository: StoreDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<StoreDoc> {
    return this.storeRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.storeRepository.deleteMany(find, options);
    return true;
  }

  async updateStatus(
    repository: StoreDoc,
    { status }: StoreUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<StoreDoc> {
    repository.status = status;
    return this.storeRepository.save(repository, options);
  }

  async findBySlug(slug: string): Promise<StoreDoc | null> {
    return this.storeRepository.findOneBySlug(slug);
  }
}
