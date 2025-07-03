import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IServicePriceService } from '../interfaces/service-price.service.interface';
import { ServicePriceRepository } from '../respository/service-price.repository';
import {
  ServicePriceDoc,
  ServicePriceEntity,
} from '../entities/service-price.entity';
import {
  IServicePriceDoc,
  IServicePriceEntity,
} from '../interfaces/service-price.interface';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { ServicePriceGetResponseDto } from '../dtos/response/service-price.get.response.dto';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import { ServicePriceGetFullResponseDto } from '../dtos/response/service-price.full.response.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';

@Injectable()
export class ServicePriceService implements IServicePriceService {
  private readonly uploadPath: string;
  constructor(
    private readonly servicePriceRepository: ServicePriceRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServicePriceDoc[]> {
    return this.servicePriceRepository.findAll<ServicePriceDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.servicePriceRepository.getTotal(find, options);
  }

  async findAllWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IServicePriceEntity[]> {
    return this.servicePriceRepository.findAll<IServicePriceEntity>(find, {
      ...options,
      join: true,
    });
  }

  async getTotalWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.servicePriceRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServicePriceDoc | null> {
    return this.servicePriceRepository.findOneById<ServicePriceDoc>(
      _id,
      options,
    );
  }

  async join(repository: ServicePriceDoc): Promise<IServicePriceDoc> {
    return this.servicePriceRepository.join(
      repository,
      this.servicePriceRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServicePriceDoc | null> {
    return this.servicePriceRepository.findOne<ServicePriceDoc>(find, options);
  }

  async create(
    {
      price,
      vehicleService,
      vehicleModel,
      dateStart,
      dateEnd,
    }: ServicePriceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<ServicePriceDoc> {
    const create: ServicePriceEntity = new ServicePriceEntity();
    create.price = price;
    create.vehicleService = vehicleService;
    create.vehicleModel = vehicleModel;
    create.dateStart = dateStart;
    create.dateEnd = dateEnd;
    return this.servicePriceRepository.create<ServicePriceEntity>(
      create,
      options,
    );
  }

  async update(
    repository: ServicePriceDoc,
    {
      price,
      vehicleService,
      vehicleModel,
      dateStart,
      dateEnd,
    }: ServicePriceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ServicePriceDoc> {
    repository.price = price ?? repository.price;
    repository.vehicleService = vehicleService ?? repository.vehicleService;
    repository.vehicleModel = vehicleModel ?? repository.vehicleModel;
    repository.dateStart = dateStart ?? repository.dateStart;
    repository.dateEnd = dateEnd ?? repository.dateEnd;
    return this.servicePriceRepository.save(repository, options);
  }

  async softDelete(
    repository: ServicePriceDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ServicePriceDoc> {
    return this.servicePriceRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.servicePriceRepository.deleteMany(find, options);
    return true;
  }

  mapList(
    ServicePrice: ServicePriceDoc[] | IServicePriceEntity[],
  ): ServicePriceListResponseDto[] {
    return plainToInstance(
      ServicePriceListResponseDto,
      ServicePrice.map((p: ServicePriceDoc | IServicePriceEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    ServicePrice: ServicePriceDoc | IServicePriceEntity,
  ): ServicePriceGetResponseDto {
    return plainToInstance(
      ServicePriceGetResponseDto,
      typeof (ServicePrice as any).toObject === 'function'
        ? (ServicePrice as any).toObject()
        : ServicePrice,
    );
  }

  mapGetPopulate(
    ServicePrice: ServicePriceDoc | IServicePriceEntity,
  ): ServicePriceGetFullResponseDto {
    return plainToInstance(
      ServicePriceGetFullResponseDto,
      typeof (ServicePrice as any).toObject === 'function'
        ? (ServicePrice as any).toObject()
        : ServicePrice,
    );
  }
}
