import { Injectable, NotFoundException } from '@nestjs/common';
import { ICareRecordItemService } from '../interfaces/care-record-item.service.interface';
import { CareRecordItemRepository } from '../respository/care-record-item.repository';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { EnumCareRecordItemStatusCodeError } from '../enums/care-record-item.status-code.enum';
import { CareRecordItem, Prisma } from '@generated/prisma-client';

@Injectable()
export class CareRecordItemService implements ICareRecordItemService {
  constructor(
    private readonly careRecordItemRepository: CareRecordItemRepository
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordItemSelect,
      Prisma.CareRecordItemWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareRecordItem>> {
    const { data, ...others } =
      await this.careRecordItemRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordItemSelect,
      Prisma.CareRecordItemWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<CareRecordItem>> {
    const { data, ...others } =
      await this.careRecordItemRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async findOneById(id: string): Promise<CareRecordItem> {
    return this.findOneByIdOrFail(id);
  }

  async findOneWithRelationsById(id: string): Promise<CareRecordItem> {
    const careRecordItem = await this.findOneByIdOrFail(id);
    return careRecordItem;
  }

  async create({
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
  }: CareRecordItemCreateRequestDto): Promise<DatabaseIdDto> {
    const created = await this.careRecordItemRepository.create({
      name,
      source,
      itemType,
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
      approvedByOwner: approvedByOwner ?? false,
      note: note ?? '',
      careRecord: { connect: { id: careRecord } },
      vehicleService: { connect: { id: vehicleService } },
      ...(part && { part: { connect: { id: part } } }),
      ...(technician && { technician: { connect: { id: technician } } }),
    });

    return { id: created.id };
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
    }: CareRecordItemUpdateRequestDto
  ): Promise<void> {
    const record = await this.findOneByIdOrFail(id);

    const updateData: any = {};
    if (vehicleService !== undefined)
      updateData.vehicleService = { connect: { id: vehicleService } };
    if (source !== undefined) updateData.source = source;
    if (itemType !== undefined) updateData.itemType = itemType;
    if (name !== undefined) updateData.name = name;
    if (part !== undefined)
      updateData.part = part ? { connect: { id: part } } : { disconnect: true };
    if (quantity !== undefined) updateData.quantity = quantity;
    if (unitPrice !== undefined) updateData.unitPrice = unitPrice;
    if (quantity !== undefined || unitPrice !== undefined) {
      const qty = quantity ?? record.quantity;
      const price = unitPrice ?? record.unitPrice;
      updateData.totalPrice = qty * price;
    }
    if (technician !== undefined)
      updateData.technician = technician
        ? { connect: { id: technician } }
        : { disconnect: true };
    if (approvedByOwner !== undefined)
      updateData.approvedByOwner = approvedByOwner;
    if (note !== undefined) updateData.note = note;

    await this.careRecordItemRepository.update(id, updateData);
  }

  async updateApproval(
    id: string,
    { approvedByOwner }: CareRecordItemUpdateApprovalRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordItemRepository.update(id, { approvedByOwner });
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordItemRepository.delete(id);
  }

  async deleteMany(find?: Record<string, any>): Promise<boolean> {
    return true;
  }

  private async findOneByIdOrFail(id: string): Promise<CareRecordItem> {
    const careRecordItem = await this.careRecordItemRepository.findOneById(id);
    if (!careRecordItem) {
      throw new NotFoundException({
        statusCode: EnumCareRecordItemStatusCodeError.notFound,
        message: 'care-record-item.error.notFound',
      });
    }
    return careRecordItem;
  }
}
