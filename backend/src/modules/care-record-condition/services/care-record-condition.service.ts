import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { CareRecordConditionRepository } from '../repository/care-record-condition.repository';
import {
  CareRecordConditionDoc,
  CareRecordConditionEntity,
} from '../entities/care-record-condition.entity';
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
    private readonly careRecordRepository: CareRecordRepository,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordConditionDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [careRecordConditions, total] = await Promise.all([
      this.careRecordConditionRepository.findAll<CareRecordConditionDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.careRecordConditionRepository.getTotal(find),
    ]);

    return {
      data: careRecordConditions,
      total,
    };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordConditionDoc> {
    const careRecordCondition = await this.findOneByIdOrFail(id, options);
    return careRecordCondition;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordConditionDoc> {
    const careRecordCondition =
      await this.careRecordConditionRepository.findOne<CareRecordConditionDoc>(
        find,
        options,
      );
    return careRecordCondition;
  }

  async create(
    {
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
    }: CareRecordConditionCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto> {
    const create: CareRecordConditionEntity = new CareRecordConditionEntity();

    create.careRecord = careRecord;
    create.odoKm = odoKm;
    create.odoKmFaulty = odoKmFaulty ?? false;
    create.fuelLevelPercent = fuelLevelPercent;
    create.fuelLevelFaulty = fuelLevelFaulty ?? false;
    create.engineOilLevel = engineOilLevel ?? ENUM_OIL_LEVEL.FULL;
    create.rearviewMirrorCondition =
      rearviewMirrorCondition ?? ENUM_REARVIEW_MIRROR_CONDITION.PRESENT;
    create.seatCondition = seatCondition ?? ENUM_SEAT_CONDITION.OK;
    create.bodyCondition = bodyCondition ?? ENUM_BODY_CONDITION.OK;
    create.exhaustCoverCondition =
      exhaustCoverCondition ?? ENUM_EXHAUST_COVER_CONDITION.PRESENT;
    create.hasLuggageRack = hasLuggageRack ?? false;
    create.hasFootMat = hasFootMat ?? false;
    create.hasFootPegRubber = hasFootPegRubber ?? false;
    create.hasRaincoat = hasRaincoat ?? false;
    create.hasHelmet = hasHelmet ?? false;
    create.accessoriesAndInoxNotes = accessoriesAndInoxNotes;
    create.currentConditionNotes = currentConditionNotes;
    create.videoUrl = videoUrl;
    create.imageUrls = imageUrls;

    const careRecordCondition =
      await this.careRecordConditionRepository.create<CareRecordConditionEntity>(
        create,
        options,
      );

    // Update isInitialConditionRecorded in care record
    if (careRecordCondition) {
      const careRecordDoc = await this.careRecordRepository.findOneById(
        careRecordCondition.careRecord,
      );
      if (careRecordDoc) {
        careRecordDoc.isInitialConditionRecorded = true;
        await this.careRecordRepository.save(careRecordDoc);
      }
    }

    return { _id: careRecordCondition._id };
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
    }: CareRecordConditionUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    if (odoKm !== undefined) repository.odoKm = odoKm;
    if (odoKmFaulty !== undefined) repository.odoKmFaulty = odoKmFaulty;
    if (fuelLevelPercent !== undefined)
      repository.fuelLevelPercent = fuelLevelPercent;
    if (fuelLevelFaulty !== undefined)
      repository.fuelLevelFaulty = fuelLevelFaulty;
    if (engineOilLevel !== undefined)
      repository.engineOilLevel = engineOilLevel;
    if (rearviewMirrorCondition !== undefined)
      repository.rearviewMirrorCondition = rearviewMirrorCondition;
    if (seatCondition !== undefined) repository.seatCondition = seatCondition;
    if (bodyCondition !== undefined) repository.bodyCondition = bodyCondition;
    if (exhaustCoverCondition !== undefined)
      repository.exhaustCoverCondition = exhaustCoverCondition;
    if (hasLuggageRack !== undefined)
      repository.hasLuggageRack = hasLuggageRack;
    if (hasFootMat !== undefined) repository.hasFootMat = hasFootMat;
    if (hasFootPegRubber !== undefined)
      repository.hasFootPegRubber = hasFootPegRubber;
    if (hasRaincoat !== undefined) repository.hasRaincoat = hasRaincoat;
    if (hasHelmet !== undefined) repository.hasHelmet = hasHelmet;
    if (accessoriesAndInoxNotes !== undefined)
      repository.accessoriesAndInoxNotes = accessoriesAndInoxNotes;
    if (currentConditionNotes !== undefined)
      repository.currentConditionNotes = currentConditionNotes;
    if (videoUrl !== undefined) repository.videoUrl = videoUrl;
    if (imageUrls !== undefined) repository.imageUrls = imageUrls;

    await this.careRecordConditionRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.careRecordConditionRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordConditionRepository.deleteMany(find, options);
    return true;
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordConditionDoc> {
    const careRecordCondition =
      await this.careRecordConditionRepository.findOneById<CareRecordConditionDoc>(
        id,
        options,
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
