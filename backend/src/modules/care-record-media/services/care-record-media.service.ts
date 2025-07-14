import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import _ from 'lodash';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ICareRecordMediaService } from '../interfaces/care-record-media.service.interface';
import { CareRecordMediaRepository } from '../respository/care-record-media.repository';
import {
  CareRecordMediaDoc,
  CareRecordMediaEntity,
} from '../entities/care-record-media.entity';
import {
  ICareRecordMediaDoc,
  ICareRecordMediaEntity,
} from '../interfaces/care-record-media.interface';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaGetResponseDto } from '../dtos/response/care-record-media.get.response.dto';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { CareRecordMediaGetFullResponseDto } from '../dtos/response/care-record-media.full.response.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';

@Injectable()
export class CareRecordMediaService implements ICareRecordMediaService {
  private readonly uploadPath: string;
  constructor(
    private readonly careRecordMediaRepository: CareRecordMediaRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordMediaDoc[]> {
    return this.careRecordMediaRepository.findAll<CareRecordMediaDoc>(
      find,
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.careRecordMediaRepository.getTotal(find, options);
  }

  async findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordMediaEntity[]> {
    return this.careRecordMediaRepository.findAll<ICareRecordMediaEntity>(
      find,
      {
        ...options,
        join: true,
      },
    );
  }

  async getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.careRecordMediaRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordMediaDoc | null> {
    return this.careRecordMediaRepository.findOneById<CareRecordMediaDoc>(
      _id,
      options,
    );
  }

  async join(repository: CareRecordMediaDoc): Promise<ICareRecordMediaDoc> {
    return this.careRecordMediaRepository.join(
      repository,
      this.careRecordMediaRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordMediaDoc | null> {
    return this.careRecordMediaRepository.findOne<CareRecordMediaDoc>(
      find,
      options,
    );
  }

  async create(
    {
      careRecord,
      stage,
      type,
      url,
      description,
    }: CareRecordMediaCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordMediaDoc> {
    const create: CareRecordMediaEntity = new CareRecordMediaEntity();
    create.careRecord = careRecord;
    create.stage = stage;
    create.type = type;
    create.url = url;
    create.description = description;

    return this.careRecordMediaRepository.create<CareRecordMediaEntity>(
      create,
      options,
    );
  }

  async update(
    repository: CareRecordMediaDoc,
    {
      careRecord,
      stage,
      type,
      url,
      description,
    }: CareRecordMediaUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordMediaDoc> {
    repository.careRecord = careRecord ?? repository.careRecord;
    repository.stage = stage ?? repository.stage;
    repository.type = type ?? repository.type;
    repository.url = url;
    repository.description = description;

    return this.careRecordMediaRepository.save(repository, options);
  }

  async delete(
    repository: CareRecordMediaDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<CareRecordMediaDoc> {
    return this.careRecordMediaRepository.delete(
      { _id: repository._id },
      options,
    );
  }

  async softDelete(
    repository: CareRecordMediaDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordMediaDoc> {
    return this.careRecordMediaRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordMediaRepository.deleteMany(find, options);
    return true;
  }

  mapList(
    CareRecordMedia: CareRecordMediaDoc[] | ICareRecordMediaEntity[],
  ): CareRecordMediaListResponseDto[] {
    return plainToInstance(
      CareRecordMediaListResponseDto,
      CareRecordMedia.map((p: CareRecordMediaDoc | ICareRecordMediaEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    CareRecordMedia: CareRecordMediaDoc | ICareRecordMediaEntity,
  ): CareRecordMediaGetResponseDto {
    return plainToInstance(
      CareRecordMediaGetResponseDto,
      typeof (CareRecordMedia as any).toObject === 'function'
        ? (CareRecordMedia as any).toObject()
        : CareRecordMedia,
    );
  }

  mapGetPopulate(
    CareRecordMedia: CareRecordMediaDoc | ICareRecordMediaEntity,
  ): CareRecordMediaGetFullResponseDto {
    return plainToInstance(
      CareRecordMediaGetFullResponseDto,
      typeof (CareRecordMedia as any).toObject === 'function'
        ? (CareRecordMedia as any).toObject()
        : CareRecordMedia,
    );
  }
}
