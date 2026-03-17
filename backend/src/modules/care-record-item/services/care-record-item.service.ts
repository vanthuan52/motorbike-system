import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ICareRecordItemService } from '../interfaces/care-record-item.service.interface';
import { CareRecordItemRepository } from '../respository/care-record-item.repository';
import {
  CareRecordItemDoc,
  CareRecordItemEntity,
} from '../entities/care-record-item.entity';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { ENUM_CARE_RECORD_ITEM_STATUS_CODE_ERROR } from '../enums/care-record-item.status-code.enum';

@Injectable()
export class CareRecordItemService implements ICareRecordItemService {
  constructor(
    private readonly careRecordItemRepository: CareRecordItemRepository,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordItemDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [careRecordItems, total] = await Promise.all([
      this.careRecordItemRepository.findAll(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: true,
      }),
      this.careRecordItemRepository.getTotal(find),
    ]);

    return {
      data: careRecordItems,
      total,
    };
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordItemDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...filters };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.careRecordItemRepository.findAllCursor(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
        join: true,
      }),
      includeCount
        ? this.careRecordItemRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    return { data, total: count };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordItemDoc> {
    const careRecordItem = await this.findOneByIdOrFail(id, {
      ...options,
      join: true,
    });
    return careRecordItem;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordItemDoc> {
    const careRecordItem =
      await this.careRecordItemRepository.findOne<CareRecordItemDoc>(
        find,
        options,
      );
    return careRecordItem;
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
  ): Promise<DatabaseIdDto> {
    const create: CareRecordItemEntity = new CareRecordItemEntity();

    create.careRecord = careRecord;
    create.vehicleService = vehicleService;
    create.source = source;
    create.itemType = itemType;
    create.name = name;
    create.quantity = quantity;
    create.unitPrice = unitPrice;
    create.part = part;
    create.technician = technician;
    create.approvedByOwner = approvedByOwner ?? false;
    create.note = note ?? '';

    const created =
      await this.careRecordItemRepository.create<CareRecordItemEntity>(
        create,
        options,
      );

    return { _id: created._id };
  }

  async update(
    id: string,
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
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.vehicleService = vehicleService ?? repository.vehicleService;
    repository.source = source ?? repository.source;
    repository.itemType = itemType ?? repository.itemType;
    repository.name = name ?? repository.name;
    repository.part = part ?? repository.part;
    repository.quantity = quantity ?? repository.quantity;
    repository.unitPrice = unitPrice ?? repository.unitPrice;
    repository.technician = technician ?? repository.technician;
    repository.approvedByOwner = approvedByOwner ?? repository.approvedByOwner;
    repository.note = note ?? repository.note;

    await this.careRecordItemRepository.save(repository, options);
  }

  async updateApproval(
    id: string,
    { approvedByOwner }: CareRecordItemUpdateApprovalRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.approvedByOwner = approvedByOwner;

    await this.careRecordItemRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.careRecordItemRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordItemRepository.deleteMany(find, options);
    return true;
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordItemDoc> {
    const careRecordItem =
      await this.careRecordItemRepository.findOneById<CareRecordItemDoc>(
        id,
        options,
      );
    if (!careRecordItem) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_ITEM_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-item.error.notFound',
      });
    }
    return careRecordItem;
  }
}
