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
import { ICareRecordServiceService } from '../interfaces/care-record-service.service.interface';
import { CareRecordServiceRepository } from '../respository/care-record-service.repository';
import {
  CareRecordServiceDoc,
  CareRecordServiceEntity,
  CareRecordServiceTableName,
} from '../entities/care-record-service.entity';
import {
  ICareRecordServiceDoc,
  ICareRecordServiceEntity,
} from '../interfaces/care-record-service.interface';
import { CareRecordServiceListResponseDto } from '../dtos/response/care-record-service.list.response.dto';
import { CareRecordServiceGetResponseDto } from '../dtos/response/care-record-service.get.response.dto';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import { CareRecordServiceGetFullResponseDto } from '../dtos/response/care-record-service.full.response.dto';
import { CareRecordServiceWithChecklistsResponseDto } from '../dtos/response/care-record-service.with-checklists.response.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { ENUM_CARE_RECORD_SERVICE_STATUS } from '../enums/care-record-service.enum';
import { UserVehicleRepository } from '@/modules/user-vehicle/repository/user-vehicle.repository';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordChecklistService } from '@/modules/care-record-checklist/services/care-record-checklist.service';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '@/common/pagination/enums/pagination.enum';

@Injectable()
export class CareRecordServiceService implements ICareRecordServiceService {
  private readonly uploadPath: string;
  constructor(
    private readonly careRecordServiceRepository: CareRecordServiceRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
    private readonly careRecordChecklistService: CareRecordChecklistService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordServiceDoc[]> {
    return this.careRecordServiceRepository.findAll<CareRecordServiceDoc>(
      find,
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.careRecordServiceRepository.getTotal(find, options);
  }

  async findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordServiceEntity[]> {
    return this.careRecordServiceRepository.findAll<ICareRecordServiceEntity>(
      find,
      {
        ...options,
        join: true,
      },
    );
  }

  async findAllWithChecklists(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordServiceWithChecklistsResponseDto[]> {
    const careRecordServices = await this.findAll(find, options);

    const result: CareRecordServiceWithChecklistsResponseDto[] = [];

    for (const careRecordService of careRecordServices) {
      const checklistFind: Record<string, any> = {
        careRecordService: careRecordService._id,
      };

      const checklists = await this.careRecordChecklistService.findAll(
        checklistFind,
        { order: { createdAt: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC } },
      );

      const mapped = this.mapWithChecklists(careRecordService, checklists);
      result.push(mapped);
    }

    return result;
  }

  async getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.careRecordServiceRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordServiceDoc | null> {
    return this.careRecordServiceRepository.findOneById<CareRecordServiceDoc>(
      _id,
      options,
    );
  }

  async join(repository: CareRecordServiceDoc): Promise<ICareRecordServiceDoc> {
    return this.careRecordServiceRepository.join(
      repository,
      this.careRecordServiceRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordServiceDoc | null> {
    return this.careRecordServiceRepository.findOne<CareRecordServiceDoc>(
      find,
      options,
    );
  }

  async create(
    { careRecord, name, vehicleService, type }: CareRecordServiceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordServiceDoc> {
    const create: CareRecordServiceEntity = new CareRecordServiceEntity();

    create.careRecord = careRecord;
    create.name = name;
    create.vehicleService = vehicleService;
    create.type = type;
    create.status = ENUM_CARE_RECORD_SERVICE_STATUS.PENDING;

    return this.careRecordServiceRepository.create<CareRecordServiceEntity>(
      create,
      options,
    );
  }

  async createMany(
    dtos: CareRecordServiceCreateRequestDto[],
    options?: IDatabaseCreateOptions,
  ): Promise<boolean> {
    const entities = dtos.map(dto => {
      const create: CareRecordServiceEntity = new CareRecordServiceEntity();
      create.careRecord = dto.careRecord;
      create.name = dto.name;
      create.vehicleService = dto.vehicleService;
      create.type = dto.type;
      create.status = ENUM_CARE_RECORD_SERVICE_STATUS.PENDING;
      return create;
    });

    await this.careRecordServiceRepository.createMany<CareRecordServiceEntity>(
      entities,
      options,
    );
    
    return true;
  }

  async update(
    repository: CareRecordServiceDoc,
    {}: CareRecordServiceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordServiceDoc> {
    return this.careRecordServiceRepository.save(repository, options);
  }

  async updateStatus(
    repository: CareRecordServiceDoc,
    { status }: CareRecordServiceUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordServiceDoc> {
    repository.status = status;

    return this.careRecordServiceRepository.save(repository, options);
  }

  async delete(
    repository: CareRecordServiceDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<CareRecordServiceDoc> {
    return this.careRecordServiceRepository.delete(
      { _id: repository._id },
      options,
    );
  }

  async softDelete(
    repository: CareRecordServiceDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordServiceDoc> {
    return this.careRecordServiceRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordServiceRepository.deleteMany(find, options);
    return true;
  }

  mapList(
    careRecordService: CareRecordServiceDoc[] | ICareRecordServiceEntity[],
  ): CareRecordServiceListResponseDto[] {
    return plainToInstance(
      CareRecordServiceListResponseDto,
      careRecordService.map(
        (p: CareRecordServiceDoc | ICareRecordServiceEntity) =>
          typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    careRecordService: CareRecordServiceDoc | ICareRecordServiceEntity,
  ): CareRecordServiceGetResponseDto {
    return plainToInstance(
      CareRecordServiceGetResponseDto,
      typeof (careRecordService as any).toObject === 'function'
        ? (careRecordService as any).toObject()
        : careRecordService,
    );
  }

  mapGetPopulate(
    careRecordService: CareRecordServiceDoc | ICareRecordServiceEntity,
  ): CareRecordServiceGetFullResponseDto {
    return plainToInstance(
      CareRecordServiceGetFullResponseDto,
      typeof (careRecordService as any).toObject === 'function'
        ? (careRecordService as any).toObject()
        : careRecordService,
    );
  }

  mapWithChecklists(
    careRecordService: CareRecordServiceDoc,
    checklists: any[],
  ): CareRecordServiceWithChecklistsResponseDto {
    const serviceData = typeof (careRecordService as any).toObject === 'function'
      ? (careRecordService as any).toObject()
      : careRecordService;

    const mappedChecklists = this.careRecordChecklistService.mapList(checklists);

    return plainToInstance(CareRecordServiceWithChecklistsResponseDto, {
      ...serviceData,
      checklists: mappedChecklists,
    });
  }
}
