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
import { ICareRecordItemService } from '../interfaces/care-record-item.service.interface';
import { CareRecordItemRepository } from '../respository/care-record-item.repository';
import {
  CareRecordItemDoc,
  CareRecordItemEntity,
} from '../entities/care-record-item.entity';
import {
  ICareRecordItemDoc,
  ICareRecordItemEntity,
} from '../interfaces/care-record-item.interface';
import { CareRecordItemListResponseDto } from '../dtos/response/care-record-item.list.response.dto';
import { CareRecordItemGetResponseDto } from '../dtos/response/care-record-item.get.response.dto';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import { CareRecordItemGetFullResponseDto } from '../dtos/response/care-record-item.full.response.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';

@Injectable()
export class CareRecordItemService implements ICareRecordItemService {
  private readonly uploadPath: string;
  constructor(
    private readonly careRecordItemRepository: CareRecordItemRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordItemDoc[]> {
    return this.careRecordItemRepository.findAll<CareRecordItemDoc>(
      find,
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.careRecordItemRepository.getTotal(find, options);
  }

  async findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordItemEntity[]> {
    return this.careRecordItemRepository.findAll<ICareRecordItemEntity>(find, {
      ...options,
      join: true,
    });
  }

  async getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.careRecordItemRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordItemDoc | null> {
    return this.careRecordItemRepository.findOneById<CareRecordItemDoc>(
      _id,
      options,
    );
  }

  async join(repository: CareRecordItemDoc): Promise<ICareRecordItemDoc> {
    return this.careRecordItemRepository.join(
      repository,
      this.careRecordItemRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordItemDoc | null> {
    return this.careRecordItemRepository.findOne<CareRecordItemDoc>(
      find,
      options,
    );
  }

  async create(
    {
      careRecord,
      vehicleService,
      source,
      itemType,
      name,
      part,
      quantity,
      unitPrice,
      technician,
      approvedByOwner,
      note,
    }: CareRecordItemCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordItemDoc> {
    const create: CareRecordItemEntity = new CareRecordItemEntity();

    create.careRecord = careRecord;
    create.vehicleService = vehicleService;
    create.source = source;
    create.itemType = itemType;
    create.name = name;
    create.quantity = quantity;
    create.unitPrice = unitPrice;
    create.itemType = itemType;
    create.part = part;
    create.technician = technician;
    create.approvedByOwner = approvedByOwner ?? false;
    create.note = note ?? '';

    return this.careRecordItemRepository.create<CareRecordItemEntity>(
      create,
      options,
    );
  }

  async update(
    repository: CareRecordItemDoc,
    {
      vehicleService,
      source,
      itemType,
      name,
      part,
      quantity,
      unitPrice,
      technician,
      approvedByOwner,
      note,
    }: CareRecordItemUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordItemDoc> {
    repository.vehicleService = vehicleService ?? repository.vehicleService;
    repository.source = source ?? repository.source;
    repository.itemType = itemType ?? repository.itemType;
    repository.name = name ?? repository.name;
    repository.part = part ?? repository.part;
    repository.quantity = quantity ?? repository.quantity;
    repository.unitPrice = unitPrice ?? repository.unitPrice;
    repository.technician = technician ?? repository.technician;
    repository.quantity = quantity ?? repository.quantity;
    repository.unitPrice = unitPrice ?? repository.unitPrice;
    repository.unitPrice = unitPrice ?? repository.unitPrice;
    repository.approvedByOwner = approvedByOwner ?? repository.approvedByOwner;
    repository.note = note ?? repository.note;

    return this.careRecordItemRepository.save(repository, options);
  }

  async updateApproval(
    repository: CareRecordItemDoc,
    { approvedByOwner }: CareRecordItemUpdateApprovalRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordItemDoc> {
    repository.approvedByOwner = approvedByOwner;

    return this.careRecordItemRepository.save(repository, options);
  }

  async delete(
    repository: CareRecordItemDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<CareRecordItemDoc> {
    return this.careRecordItemRepository.delete(
      { _id: repository._id },
      options,
    );
  }

  async softDelete(
    repository: CareRecordItemDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordItemDoc> {
    return this.careRecordItemRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordItemRepository.deleteMany(find, options);
    return true;
  }

  mapList(
    CareRecordItem: CareRecordItemDoc[] | ICareRecordItemEntity[],
  ): CareRecordItemListResponseDto[] {
    return plainToInstance(
      CareRecordItemListResponseDto,
      CareRecordItem.map((p: CareRecordItemDoc | ICareRecordItemEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    CareRecordItem: CareRecordItemDoc | ICareRecordItemEntity,
  ): CareRecordItemGetResponseDto {
    return plainToInstance(
      CareRecordItemGetResponseDto,
      typeof (CareRecordItem as any).toObject === 'function'
        ? (CareRecordItem as any).toObject()
        : CareRecordItem,
    );
  }

  mapGetPopulate(
    CareRecordItem: CareRecordItemDoc | ICareRecordItemEntity,
  ): CareRecordItemGetFullResponseDto {
    return plainToInstance(
      CareRecordItemGetFullResponseDto,
      typeof (CareRecordItem as any).toObject === 'function'
        ? (CareRecordItem as any).toObject()
        : CareRecordItem,
    );
  }
}
