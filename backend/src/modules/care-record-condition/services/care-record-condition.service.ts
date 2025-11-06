import { Injectable } from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { CareRecordConditionRepository } from '../respository/care-record-condition.repository';
import {
  CareRecordConditionDoc,
  CareRecordConditionEntity,
} from '../entities/care-record-condition.entity';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { CareRecordConditionGetResponseDto } from '../dtos/response/care-record-condition.get.response.dto';
import { plainToInstance } from 'class-transformer';
import { CareRecordRepository } from '@/modules/care-record/respository/care-record.repository';
import {
  ENUM_BODY_CONDITION,
  ENUM_EXHAUST_COVER_CONDITION,
  ENUM_OIL_LEVEL,
  ENUM_REARVIEW_MIRROR_CONDITION,
  ENUM_SEAT_CONDITION,
} from '../enums/care-record-condition.enum';
import { ICareRecordConditionService } from '../interfaces/care-record-condition.service.interface';

@Injectable()
export class CareRecordConditionService implements ICareRecordConditionService {
  constructor(
    private readonly careRecordConditionRepository: CareRecordConditionRepository,
    private readonly careRecordRepository: CareRecordRepository,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordConditionDoc[]> {
    return this.careRecordConditionRepository.findAll<CareRecordConditionDoc>(
      find,
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.careRecordConditionRepository.getTotal(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordConditionDoc | null> {
    return this.careRecordConditionRepository.findOneById<CareRecordConditionDoc>(
      _id,
      options,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordConditionDoc | null> {
    return this.careRecordConditionRepository.findOne<CareRecordConditionDoc>(
      find,
      options,
    );
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
  ): Promise<CareRecordConditionDoc> {
    const create: CareRecordConditionEntity = new CareRecordConditionEntity();

    // Assign properties from DTO to entity with default values for required fields
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

    // Create care record condition
    const careRecordCondition =
      await this.careRecordConditionRepository.create<CareRecordConditionEntity>(
        create,
        options,
      );

    // Update isInitialConditionRecorded in care record
    if (careRecordCondition) {
      const careRecord = await this.careRecordRepository.findOneById(
        careRecordCondition.careRecord,
      );
      if (careRecord) {
        careRecord.isInitialConditionRecorded = true;
        await this.careRecordRepository.save(careRecord);
      }
    }

    return careRecordCondition;
  }

  async update(
    repository: CareRecordConditionDoc,
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
  ): Promise<CareRecordConditionDoc> {
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

    return this.careRecordConditionRepository.save(repository, options);
  }

  async delete(
    repository: CareRecordConditionDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<CareRecordConditionDoc> {
    return this.careRecordConditionRepository.delete(
      { _id: repository._id },
      options,
    );
  }

  async softDelete(
    repository: CareRecordConditionDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordConditionDoc> {
    return this.careRecordConditionRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordConditionRepository.deleteMany(find, options);
    return true;
  }

  mapList(
    careRecords: CareRecordConditionDoc[],
  ): CareRecordConditionGetResponseDto[] {
    return careRecords.map((record) => this.mapGet(record));
  }

  mapGet(
    careRecord: CareRecordConditionDoc,
  ): CareRecordConditionGetResponseDto {
    return plainToInstance(
      CareRecordConditionGetResponseDto,
      typeof careRecord.toObject === 'function'
        ? careRecord.toObject()
        : careRecord,
    );
  }
}
