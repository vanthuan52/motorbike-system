import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PipelineStage, RootFilterQuery } from 'mongoose';
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
import { ICareRecordService } from '../interfaces/care-record.service.interface';
import { CareRecordRepository } from '../respository/care-record.repository';
import {
  CareRecordDoc,
  CareRecordEntity,
  CareRecordTableName,
} from '../entities/care-record.entity';
import {
  IModelCareRecord,
  ICareRecordDoc,
  ICareRecordEntity,
} from '../interfaces/care-record.interface';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordGetResponseDto } from '../dtos/response/care-record.get.response.dto';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { ENUM_CARE_RECORD_STATUS } from '../enums/care-record.enum';

import { VehicleServiceTableName } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { VehicleModelTableName } from '@/modules/vehicle-model/entities/vehicle-model.entity';
import { VehicleModelRepository } from '@/modules/vehicle-model/repository/vehicle-model.repository';

@Injectable()
export class CareRecordService implements ICareRecordService {
  private readonly uploadPath: string;
  constructor(
    private readonly CareRecordRepository: CareRecordRepository,
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordDoc[]> {
    return this.CareRecordRepository.findAll<CareRecordDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.CareRecordRepository.getTotal(find, options);
  }

  async findAllWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordEntity[]> {
    return this.CareRecordRepository.findAll<ICareRecordEntity>(find, {
      ...options,
      join: true,
    });
  }

  async getTotalWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.CareRecordRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc | null> {
    return this.CareRecordRepository.findOneById<CareRecordDoc>(_id, options);
  }

  async join(repository: CareRecordDoc): Promise<ICareRecordDoc> {
    return this.CareRecordRepository.join(
      repository,
      this.CareRecordRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc | null> {
    return this.CareRecordRepository.findOne<CareRecordDoc>(find, options);
  }

  async create(
    {
      price,
      vehicleService,
      vehicleModel,
      dateStart,
      dateEnd,
    }: CareRecordCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordDoc> {
    const create: CareRecordEntity = new CareRecordEntity();

    return this.CareRecordRepository.create<CareRecordEntity>(create, options);
  }

  async update(
    repository: CareRecordDoc,
    {
      price,
      vehicleService,
      vehicleModel,
      dateStart,
      dateEnd,
    }: CareRecordUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc> {
    return this.CareRecordRepository.save(repository, options);
  }

  async delete(
    repository: CareRecordDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<CareRecordDoc> {
    return this.CareRecordRepository.delete({ _id: repository._id }, options);
  }

  async softDelete(
    repository: CareRecordDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc> {
    return this.CareRecordRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.CareRecordRepository.deleteMany(find, options);
    return true;
  }

  mapList(
    CareRecord: CareRecordDoc[] | ICareRecordEntity[],
  ): CareRecordListResponseDto[] {
    return plainToInstance(
      CareRecordListResponseDto,
      CareRecord.map((p: CareRecordDoc | ICareRecordEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    CareRecord: CareRecordDoc | ICareRecordEntity,
  ): CareRecordGetResponseDto {
    return plainToInstance(
      CareRecordGetResponseDto,
      typeof (CareRecord as any).toObject === 'function'
        ? (CareRecord as any).toObject()
        : CareRecord,
    );
  }

  mapGetPopulate(
    CareRecord: CareRecordDoc | ICareRecordEntity,
  ): CareRecordGetFullResponseDto {
    return plainToInstance(
      CareRecordGetFullResponseDto,
      typeof (CareRecord as any).toObject === 'function'
        ? (CareRecord as any).toObject()
        : CareRecord,
    );
  }
}
