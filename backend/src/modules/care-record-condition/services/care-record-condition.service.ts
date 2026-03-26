import { Injectable, NotFoundException } from '@nestjs/common';

import { CareRecordConditionRepository } from '../repository/care-record-condition.repository';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { CareRecordRepository } from '@/modules/care-record/respository/care-record.repository';
import {
  EnumBodyCondition,
  EnumExhaustCoverCondition,
  EnumOilLevel,
  EnumMirrorCondition,
  EnumSeatCondition,
} from '../enums/care-record-condition.enum';
import { ICareRecordConditionService } from '../interfaces/care-record-condition.service.interface';
import { EnumCareRecordConditionStatusCodeError } from '../enums/care-record-condition.status-code.enum';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CareRecordCondition, Prisma } from '@/generated/prisma-client';

@Injectable()
export class CareRecordConditionService implements ICareRecordConditionService {
  constructor(
    private readonly careRecordConditionRepository: CareRecordConditionRepository,
    private readonly careRecordRepository: CareRecordRepository
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordConditionSelect,
      Prisma.CareRecordConditionWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareRecordCondition>> {
    const { data, ...others } =
      await this.careRecordConditionRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordConditionSelect,
      Prisma.CareRecordConditionWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<CareRecordCondition>> {
    const { data, ...others } =
      await this.careRecordConditionRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });
    return { data, ...others };
  }

  async findOneById(id: string): Promise<CareRecordCondition> {
    const careRecordCondition = await this.findOneByIdOrFail(id);
    return careRecordCondition;
  }

  async create({
    careRecord,
    odoKm,
    odoKmFaulty,
    fuelLevelPercent,
    fuelLevelFaulty,
    engineOilLevel,
    rearviewMirrorCondition,
    seatCondition,
    bodyCondition,
    exhaustCoverCondition,
    hasLuggageRack,
    hasFootMat,
    hasFootPegRubber,
    hasRaincoat,
    hasHelmet,
    accessoriesAndInoxNotes,
    currentConditionNotes,
    videoUrl,
    imageUrls,
  }: CareRecordConditionCreateRequestDto): Promise<DatabaseIdDto> {
    const careRecordCondition = await this.careRecordConditionRepository.create(
      {
        odoKm,
        odoKmFaulty: odoKmFaulty ?? false,
        fuelLevelPercent,
        fuelLevelFaulty: fuelLevelFaulty ?? false,
        engineOilLevel: engineOilLevel ?? EnumOilLevel.full,
        rearviewMirrorCondition:
          rearviewMirrorCondition ?? EnumMirrorCondition.present,
        seatCondition: seatCondition ?? EnumSeatCondition.ok,
        bodyCondition: bodyCondition ?? EnumBodyCondition.ok,
        exhaustCoverCondition:
          exhaustCoverCondition ?? EnumExhaustCoverCondition.present,
        hasLuggageRack: hasLuggageRack ?? false,
        hasFootMat: hasFootMat ?? false,
        hasFootPegRubber: hasFootPegRubber ?? false,
        hasRaincoat: hasRaincoat ?? false,
        hasHelmet: hasHelmet ?? false,
        accessoriesAndInoxNotes,
        currentConditionNotes,
        videoUrl,
        imageUrls,
        careRecord: {
          connect: { id: careRecord },
        },
      }
    );

    // Update isInitialConditionRecorded in care record
    if (careRecordCondition) {
      const careRecordDoc =
        await this.careRecordRepository.findOneById(careRecord);
      if (careRecordDoc) {
        await this.careRecordRepository.update(careRecord, {
          isInitialConditionRecorded: true,
        });
      }
    }

    return { id: careRecordCondition.id };
  }

  async update(
    id: string,
    {
      odoKm,
      odoKmFaulty,
      fuelLevelPercent,
      fuelLevelFaulty,
      engineOilLevel,
      rearviewMirrorCondition,
      seatCondition,
      bodyCondition,
      exhaustCoverCondition,
      hasLuggageRack,
      hasFootMat,
      hasFootPegRubber,
      hasRaincoat,
      hasHelmet,
      accessoriesAndInoxNotes,
      currentConditionNotes,
      videoUrl,
      imageUrls,
    }: CareRecordConditionUpdateRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);

    const updateData: any = {};
    if (odoKm !== undefined) updateData.odoKm = odoKm;
    if (odoKmFaulty !== undefined) updateData.odoKmFaulty = odoKmFaulty;
    if (fuelLevelPercent !== undefined)
      updateData.fuelLevelPercent = fuelLevelPercent;
    if (fuelLevelFaulty !== undefined)
      updateData.fuelLevelFaulty = fuelLevelFaulty;
    if (engineOilLevel !== undefined)
      updateData.engineOilLevel = engineOilLevel;
    if (rearviewMirrorCondition !== undefined)
      updateData.rearviewMirrorCondition = rearviewMirrorCondition;
    if (seatCondition !== undefined) updateData.seatCondition = seatCondition;
    if (bodyCondition !== undefined) updateData.bodyCondition = bodyCondition;
    if (exhaustCoverCondition !== undefined)
      updateData.exhaustCoverCondition = exhaustCoverCondition;
    if (hasLuggageRack !== undefined)
      updateData.hasLuggageRack = hasLuggageRack;
    if (hasFootMat !== undefined) updateData.hasFootMat = hasFootMat;
    if (hasFootPegRubber !== undefined)
      updateData.hasFootPegRubber = hasFootPegRubber;
    if (hasRaincoat !== undefined) updateData.hasRaincoat = hasRaincoat;
    if (hasHelmet !== undefined) updateData.hasHelmet = hasHelmet;
    if (accessoriesAndInoxNotes !== undefined)
      updateData.accessoriesAndInoxNotes = accessoriesAndInoxNotes;
    if (currentConditionNotes !== undefined)
      updateData.currentConditionNotes = currentConditionNotes;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (imageUrls !== undefined) updateData.imageUrls = imageUrls;

    await this.careRecordConditionRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordConditionRepository.delete(id);
  }

  async deleteMany(find?: Record<string, any>): Promise<boolean> {
    // Implementation would depend on Prisma deleteMany capability
    // For now, this is a placeholder
    return true;
  }

  private async findOneByIdOrFail(id: string): Promise<CareRecordCondition> {
    const careRecordCondition =
      await this.careRecordConditionRepository.findOneById<CareRecordCondition>(
        id
      );
    if (!careRecordCondition) {
      throw new NotFoundException({
        statusCode: EnumCareRecordConditionStatusCodeError.notFound,
        message: 'care-record-condition.error.notFound',
      });
    }
    return careRecordCondition;
  }
}
