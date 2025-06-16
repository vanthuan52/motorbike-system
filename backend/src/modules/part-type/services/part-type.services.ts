import { Injectable } from '@nestjs/common';
import { PartTypeRepository } from '../repository/part-type.repository';
import { IPartTypeService } from '../interfaces/part-type.service.interface';
import { PartTypeDoc, PartTypeEntity } from '../entities/part-type.entity';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { ENUM_PART_TYPE_STATUS } from '../enums/part-type.enum';
import { PartTypeGetResponseDto } from '../dtos/response/part-type.get.response.dto';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import { IPartTypeEntity } from '../interfaces/part-type.interface';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PartTypeService implements IPartTypeService {
  constructor(private readonly partTypeRepository: PartTypeRepository) {}
  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const partType = await this.partTypeRepository.findOne({ name }, options);
    return !!partType;
  }
  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const partType = await this.partTypeRepository.findOne({ slug }, options);
    return !!partType;
  }
  createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  mapList(
    partType: PartTypeDoc[] | IPartTypeEntity[],
  ): PartTypeListResponseDto[] {
    return plainToInstance(
      PartTypeListResponseDto,
      partType.map((p: PartTypeDoc | IPartTypeEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }
  mapGet(partType: PartTypeDoc | IPartTypeEntity): PartTypeGetResponseDto {
    return plainToInstance(
      PartTypeGetResponseDto,
      typeof (partType as any).toObject === 'function'
        ? (partType as any).toObject()
        : partType,
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<PartTypeDoc[]> {
    return this.partTypeRepository.findAll<PartTypeDoc>(find, options);
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<PartTypeDoc[]> {
    return this.partTypeRepository.findAll<PartTypeDoc>(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartTypeDoc | null> {
    return this.partTypeRepository.findOneById<PartTypeDoc>(_id, options);
  }
  async join(repository: PartTypeDoc): Promise<PartTypeDoc> {
    return this.partTypeRepository.join(repository, this.partTypeRepository._join!);
  }
  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartTypeDoc | null> {
    return this.partTypeRepository.findOne<PartTypeDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.partTypeRepository.getTotal(find, options);
  }

  async create(
    { name, slug, description,  photo }: PartTypeCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<PartTypeDoc> {
    const create: PartTypeEntity = new PartTypeEntity();
    create.name = name;
    create.slug = slug.toLowerCase();
    create.description = description;
    create.status = ENUM_PART_TYPE_STATUS.ACTIVE;
    create.photo = photo;

    return this.partTypeRepository.create<PartTypeEntity>(create, options);
  }

  async update(
    repository: PartTypeDoc,
    { name, slug, description, photo }: PartTypeUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PartTypeDoc> {
    repository.name = name ?? repository.name;
    repository.slug = slug ?? repository.slug;
    repository.description = description;
    repository.photo = photo;

    return this.partTypeRepository.save(repository, options);
  }

  async softDelete(
    repository: PartTypeDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PartTypeDoc> {
    return this.partTypeRepository.softDelete(repository, options);
  }


  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.partTypeRepository.deleteMany(find, options);
    return true;
  }
  async updateStatus(
    repository: PartTypeDoc,
    { status }: PartTypeUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PartTypeDoc> {
    repository.status = status;

    return this.partTypeRepository.save(repository, options);
  }
  async findBySlug(slug: string): Promise<PartTypeDoc | null> {
    return this.partTypeRepository.findOneBySlug(slug);
  }
}
