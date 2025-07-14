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
import { ICareRecordChecklistService } from '../interfaces/care-record-checklist.service.interface';
import { CareRecordChecklistRepository } from '../respository/care-record-checklist.repository';
import {
  CareRecordChecklistDoc,
  CareRecordChecklistEntity,
  CareRecordChecklistTableName,
} from '../entities/care-record-checklist.entity';
import {
  ICareRecordChecklistDoc,
  ICareRecordChecklistEntity,
} from '../interfaces/care-record-checklist.interface';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistGetResponseDto } from '../dtos/response/care-record-checklist.get.response.dto';
import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { ENUM_CARE_RECORD_CHECKLIST_STATUS } from '../enums/care-record-checklist.enum';
import { UserVehicleRepository } from '@/modules/user-vehicle/repository/user-vehicle.repository';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateNoteRequestDto } from '../dtos/request/care-record-checklist.update-note.request.dto';
import { CareRecordChecklistUpdateWearPercentageRequestDto } from '../dtos/request/care-record-checklist.update-wear-percentage.request.dto';

@Injectable()
export class CareRecordChecklistService implements ICareRecordChecklistService {
  private readonly uploadPath: string;
  constructor(
    private readonly careRecordChecklistRepository: CareRecordChecklistRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordChecklistDoc[]> {
    return this.careRecordChecklistRepository.findAll<CareRecordChecklistDoc>(
      find,
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.careRecordChecklistRepository.getTotal(find, options);
  }

  async findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordChecklistEntity[]> {
    return this.careRecordChecklistRepository.findAll<ICareRecordChecklistEntity>(
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
    return this.careRecordChecklistRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordChecklistDoc | null> {
    return this.careRecordChecklistRepository.findOneById<CareRecordChecklistDoc>(
      _id,
      options,
    );
  }

  async join(
    repository: CareRecordChecklistDoc,
  ): Promise<ICareRecordChecklistDoc> {
    return this.careRecordChecklistRepository.join(
      repository,
      this.careRecordChecklistRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordChecklistDoc | null> {
    return this.careRecordChecklistRepository.findOne<CareRecordChecklistDoc>(
      find,
      options,
    );
  }

  async create(
    {
      careRecord,
      serviceChecklist,
      wearPercentage,
    }: CareRecordChecklistCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordChecklistDoc> {
    const create: CareRecordChecklistEntity = new CareRecordChecklistEntity();

    create.careRecord = careRecord;
    create.serviceChecklist = serviceChecklist;
    create.wearPercentage = wearPercentage;
    create.status = ENUM_CARE_RECORD_CHECKLIST_STATUS.UNCHECKED;

    return this.careRecordChecklistRepository.create<CareRecordChecklistEntity>(
      create,
      options,
    );
  }

  async update(
    repository: CareRecordChecklistDoc,
    { status, note, wearPercentage }: CareRecordChecklistUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc> {
    repository.status =
      (status as ENUM_CARE_RECORD_CHECKLIST_STATUS) ?? repository.status;
    repository.note = note ?? repository.note;
    repository.wearPercentage = wearPercentage ?? repository.wearPercentage;

    return this.careRecordChecklistRepository.save(repository, options);
  }

  async updateStatus(
    repository: CareRecordChecklistDoc,
    { status }: CareRecordChecklistUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc> {
    repository.status = status;

    return this.careRecordChecklistRepository.save(repository, options);
  }

  async updateNote(
    repository: CareRecordChecklistDoc,
    { note }: CareRecordChecklistUpdateNoteRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc> {
    repository.note = note;

    return this.careRecordChecklistRepository.save(repository, options);
  }

  async updateWearPercentage(
    repository: CareRecordChecklistDoc,
    { wearPercentage }: CareRecordChecklistUpdateWearPercentageRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc> {
    repository.wearPercentage = wearPercentage;

    return this.careRecordChecklistRepository.save(repository, options);
  }

  async delete(
    repository: CareRecordChecklistDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<CareRecordChecklistDoc> {
    return this.careRecordChecklistRepository.delete(
      { _id: repository._id },
      options,
    );
  }

  async softDelete(
    repository: CareRecordChecklistDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordChecklistDoc> {
    return this.careRecordChecklistRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordChecklistRepository.deleteMany(find, options);
    return true;
  }

  mapList(
    careRecordChecklist:
      | CareRecordChecklistDoc[]
      | ICareRecordChecklistEntity[],
  ): CareRecordChecklistListResponseDto[] {
    return plainToInstance(
      CareRecordChecklistListResponseDto,
      careRecordChecklist.map(
        (p: CareRecordChecklistDoc | ICareRecordChecklistEntity) =>
          typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    careRecordChecklist: CareRecordChecklistDoc | ICareRecordChecklistEntity,
  ): CareRecordChecklistGetResponseDto {
    return plainToInstance(
      CareRecordChecklistGetResponseDto,
      typeof (careRecordChecklist as any).toObject === 'function'
        ? (careRecordChecklist as any).toObject()
        : careRecordChecklist,
    );
  }

  mapGetPopulate(
    careRecordChecklist: CareRecordChecklistDoc | ICareRecordChecklistEntity,
  ): CareRecordChecklistGetFullResponseDto {
    return plainToInstance(
      CareRecordChecklistGetFullResponseDto,
      typeof (careRecordChecklist as any).toObject === 'function'
        ? (careRecordChecklist as any).toObject()
        : careRecordChecklist,
    );
  }
}
