import { Injectable, NotFoundException } from '@nestjs/common';
import { CareRecordCondition } from '@prisma/client';
import { CareRecordConditionRepository } from '../repository/care-record-condition.repository';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { CareRecordRepository } from '@/modules/care-record/respository/care-record.repository';
import {
  ENUM_BODY_CONDITION,
  ENUM_EXHAUST_COVER_CONDITION,
  ENUM_OIL_LEVEL,
  ENUM_REARVIEW_MIRROR_CONDITION,
  ENUM_SEAT_CONDITION,
} from '../enums/care-record-condition.enum';
import { ICareRecordConditionService } from '../interfaces/care-record-condition.service.interface';
import { ENUM_CARE_RECORD_CONDITION_STATUS_CODE_ERROR } from '../enums/care-record-condition.status-code.enum';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

@Injectable()
export class CareRecordConditionService implements ICareRecordConditionService {
  constructor(
    private readonly careRecordConditionRepository: CareRecordConditionRepository,
    private readonly careRecordRepository: CareRecordRepository
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordCondition[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [careRecordConditions, total] =
      await this.careRecordConditionRepository.findWithPaginationOffset<CareRecordCondition>(
        find,
        {
          limit,
          offset: skip,
          orderBy,
        }
      );

    return {
      data: careRecordConditions,
      total,
    };
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
        engineOilLevel: engineOilLevel ?? ENUM_OIL_LEVEL.FULL,
        rearviewMirrorCondition:
          rearviewMirrorCondition ?? ENUM_REARVIEW_MIRROR_CONDITION.PRESENT,
        seatCondition: seatCondition ?? ENUM_SEAT_CONDITION.OK,
        bodyCondition: bodyCondition ?? ENUM_BODY_CONDITION.OK,
        exhaustCoverCondition:
          exhaustCoverCondition ?? ENUM_EXHAUST_COVER_CONDITION.PRESENT,
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

    return { _id: careRecordCondition.id };
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
        statusCode: ENUM_CARE_RECORD_CONDITION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-condition.error.notFound',
      });
    }
    return careRecordCondition;
  }
}
