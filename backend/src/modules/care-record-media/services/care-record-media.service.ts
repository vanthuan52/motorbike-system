import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ICareRecordMediaService } from '../interfaces/care-record-media.service.interface';
import { CareRecordMediaRepository } from '../respository/care-record-media.repository';
import {
  CareRecordMediaDoc,
  CareRecordMediaEntity,
} from '../entities/care-record-media.entity';
import { ICareRecordMediaEntity } from '../interfaces/care-record-media.interface';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

@Injectable()
export class CareRecordMediaService implements ICareRecordMediaService {
  constructor(
    private readonly careRecordMediaRepository: CareRecordMediaRepository,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordMediaDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [careRecordMedias, total] = await Promise.all([
      this.careRecordMediaRepository.findAll<ICareRecordMediaEntity>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: true,
      }),
      this.careRecordMediaRepository.getTotal(find),
    ]);

    return {
      data: careRecordMedias as unknown as CareRecordMediaDoc[],
      total,
    };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordMediaDoc> {
    const careRecordMedia = await this.findOneByIdOrFail(id, {
      ...options,
      join: true,
    });
    return careRecordMedia;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordMediaDoc> {
    const careRecordMedia =
      await this.careRecordMediaRepository.findOne<CareRecordMediaDoc>(
        find,
        options,
      );
    return careRecordMedia;
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
  ): Promise<DatabaseIdDto> {
    const create: CareRecordMediaEntity = new CareRecordMediaEntity();
    create.careRecord = careRecord;
    create.stage = stage;
    create.type = type;
    create.url = url;
    create.description = description;

    const created =
      await this.careRecordMediaRepository.create<CareRecordMediaEntity>(
        create,
        options,
      );

    return { _id: created._id };
  }

  async update(
    id: string,
    {
      careRecord,
      stage,
      type,
      url,
      description,
    }: CareRecordMediaUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.careRecord = careRecord ?? repository.careRecord;
    repository.stage = stage ?? repository.stage;
    repository.type = type ?? repository.type;
    repository.url = url ?? repository.url;
    repository.description = description ?? repository.description;

    await this.careRecordMediaRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.careRecordMediaRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordMediaRepository.deleteMany(find, options);
    return true;
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordMediaDoc> {
    const careRecordMedia =
      await this.careRecordMediaRepository.findOneById<CareRecordMediaDoc>(
        id,
        options,
      );
    if (!careRecordMedia) {
      throw new NotFoundException({
        statusCode: 5003,
        message: 'care-record-media.error.notFound',
      });
    }
    return careRecordMedia;
  }
}
