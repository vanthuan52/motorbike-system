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
import { ICareRecordService } from '../interfaces/care-record.service.interface';
import { CareRecordRepository } from '../respository/care-record.repository';
import {
  CareRecordDoc,
  CareRecordEntity,
  CareRecordTableName,
} from '../entities/care-record.entity';
import {
  ICareRecordDoc,
  ICareRecordEntity,
} from '../interfaces/care-record.interface';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordGetResponseDto } from '../dtos/response/care-record.get.response.dto';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../enums/care-record.enum';
import { UserVehicleRepository } from '@/modules/user-vehicle/repository/user-vehicle.repository';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';

@Injectable()
export class CareRecordService implements ICareRecordService {
  private readonly uploadPath: string;
  constructor(
    private readonly careRecordRepository: CareRecordRepository,
    private readonly userVehicleRepository: UserVehicleRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordDoc[]> {
    return this.careRecordRepository.findAll<CareRecordDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.careRecordRepository.getTotal(find, options);
  }

  async findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordEntity[]> {
    return this.careRecordRepository.findAll<ICareRecordEntity>(find, {
      ...options,
      join: true,
    });
  }

  async getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.careRecordRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc | null> {
    return this.careRecordRepository.findOneById<CareRecordDoc>(_id, options);
  }

  async join(repository: CareRecordDoc): Promise<ICareRecordDoc> {
    return this.careRecordRepository.join(
      repository,
      this.careRecordRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc | null> {
    return this.careRecordRepository.findOne<CareRecordDoc>(find, options);
  }

  async create(
    {
      appointment,
      userVehicle,
      technician,
      store,
      confirmedByOwner,
    }: CareRecordCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordDoc> {
    const create: CareRecordEntity = new CareRecordEntity();
    create.appointment = appointment;
    create.userVehicle = userVehicle;
    create.technician = technician;
    create.store = store;
    create.confirmedByOwner = confirmedByOwner ? confirmedByOwner : false;
    create.status = ENUM_CARE_RECORD_STATUS.PENDING;
    create.paymentStatus = ENUM_PAYMENT_STATUS.UNPAID;

    return this.careRecordRepository.create<CareRecordEntity>(create, options);
  }

  async update(
    repository: CareRecordDoc,
    { confirmedByOwner }: CareRecordUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc> {
    repository.confirmedByOwner =
      confirmedByOwner ?? repository.confirmedByOwner;

    return this.careRecordRepository.save(repository, options);
  }

  async updateStatus(
    repository: CareRecordDoc,
    { status }: CareRecordUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc> {
    repository.status = status;

    return this.careRecordRepository.save(repository, options);
  }

  async updatePaymentStatus(
    repository: CareRecordDoc,
    { paymentStatus }: CareRecordUpdatePaymentStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc> {
    repository.paymentStatus = paymentStatus;

    return this.careRecordRepository.save(repository, options);
  }

  async updateTechnician(
    repository: CareRecordDoc,
    { technician }: CareRecordUpdateTechnicianRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc> {
    repository.technician = technician;

    return this.careRecordRepository.save(repository, options);
  }

  async delete(
    repository: CareRecordDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<CareRecordDoc> {
    return this.careRecordRepository.delete({ _id: repository._id }, options);
  }

  async softDelete(
    repository: CareRecordDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc> {
    return this.careRecordRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordRepository.deleteMany(find, options);
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
    careRecord: CareRecordDoc | ICareRecordEntity,
  ): CareRecordGetFullResponseDto {
    return plainToInstance(
      CareRecordGetFullResponseDto,
      typeof (careRecord as any).toObject === 'function'
        ? (careRecord as any).toObject()
        : careRecord,
    );
  }
}
