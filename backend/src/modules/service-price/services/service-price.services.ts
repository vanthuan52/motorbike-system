import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicePriceRepository } from '../repository/service-price.repository';
import { IServicePriceService } from '../interfaces/service-price.service.interface';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_SERVICE_PRICE_STATUS_CODE_ERROR } from '../enums/service-price.status-code.enum';
import { VehicleModelRepository } from '@/modules/vehicle-model/repository/vehicle-model.repository';
import { VehicleServiceRepository } from '@/modules/vehicle-service/repository/vehicle-service.repository';
import { ServicePriceModel } from '../models/service-price.model';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { ServicePriceUtil } from '../utils/service-price.util';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class ServicePriceService implements IServicePriceService {
  constructor(
    private readonly servicePriceRepository: ServicePriceRepository,
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly vehicleServiceRepository: VehicleServiceRepository,
    private readonly servicePriceUtil: ServicePriceUtil
  ) {}

  async getListOffset(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<ServicePriceModel>> {
    return this.servicePriceRepository.findWithPaginationOffset(
      {
        limit,
        skip,
        where,
        orderBy,
      },
      filters
    );
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<ServicePriceModel>> {
    return this.servicePriceRepository.findWithPaginationCursor(
      {
        limit,
        where,
        orderBy,
        cursor,
        cursorField,
        includeCount,
      },
      filters
    );
  }

  async findOneById(id: string): Promise<ServicePriceModel> {
    const servicePrice = await this.servicePriceRepository.findOneById(id);
    if (!servicePrice) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-price.error.notFound',
      });
    }
    return servicePrice;
  }

  async findOne(find: Record<string, any>): Promise<ServicePriceModel | null> {
    return this.servicePriceRepository.findOne(find);
  }

  async create(
    {
      price,
      vehicleService,
      vehicleModel,
      dateStart,
      dateEnd,
    }: ServicePriceCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<IResponseReturn<{ id: string }>> {
    // Validate relationships
    const checkVehicleService =
      await this.vehicleServiceRepository.findOneById(vehicleService);
    const checkVehicleModel =
      await this.vehicleModelRepository.findOneById(vehicleModel);

    if (!checkVehicleService) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-service.error.notFound',
      });
    }

    if (!checkVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model-type.error.notFound',
      });
    }

    const data: Prisma.ServicePriceCreateInput = {
      price,
      vehicleService: { connect: { id: vehicleService } },
      vehicleModel: { connect: { id: vehicleModel } },
      dateStart: dateStart ? new Date(dateStart) : new Date(),
      dateEnd: dateEnd ? new Date(dateEnd) : null,
      createdBy,
    };

    const created = await this.servicePriceRepository.create(data);
    return {
      data: { id: created.id },
      metadataActivityLog:
        this.servicePriceUtil.mapActivityLogMetadata(created),
    };
  }

  async update(
    id: string,
    {
      price,
      vehicleService,
      vehicleModel,
      dateStart,
      dateEnd,
    }: ServicePriceUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IResponseReturn<void>> {
    const servicePrice = await this.servicePriceRepository.findOneById(id);
    if (!servicePrice) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-price.error.notFound',
      });
    }

    // Validate if references are changed
    if (vehicleService && vehicleService !== servicePrice.vehicleServiceId) {
      const checkVehicleService =
        await this.vehicleServiceRepository.findOneById(vehicleService);
      if (!checkVehicleService) {
        throw new NotFoundException({
          statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'vehicle-service.error.notFound',
        });
      }
    }

    if (vehicleModel && vehicleModel !== servicePrice.vehicleModelId) {
      const checkVehicleModel =
        await this.vehicleModelRepository.findOneById(vehicleModel);
      if (!checkVehicleModel) {
        throw new NotFoundException({
          statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'vehicle-model-type.error.notFound',
        });
      }
    }

    const data: Prisma.ServicePriceUpdateInput = {
      price: price ?? undefined,
      vehicleService: vehicleService
        ? { connect: { id: vehicleService } }
        : undefined,
      vehicleModel: vehicleModel
        ? { connect: { id: vehicleModel } }
        : undefined,
      dateStart: dateStart ? new Date(dateStart) : undefined,
      dateEnd: dateEnd ? new Date(dateEnd) : undefined,
      updatedBy,
    };

    const updated = await this.servicePriceRepository.update(id, data);
    return {
      metadataActivityLog:
        this.servicePriceUtil.mapActivityLogMetadata(updated),
    };
  }

  async findAll(
    where: Prisma.ServicePriceWhereInput
  ): Promise<ServicePriceModel[]> {
    return this.servicePriceRepository.findAll({ limit: 100, skip: 0 }, where);
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<IResponseReturn<void>> {
    const servicePrice = await this.servicePriceRepository.findOneById(id);
    if (!servicePrice) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-price.error.notFound',
      });
    }

    const deleted = await this.servicePriceRepository.update(id, {
      deletedAt: new Date(),
      deletedBy,
    } as any);

    return {
      metadataActivityLog:
        this.servicePriceUtil.mapActivityLogMetadata(deleted),
    };
  }

  async getLatestServicePrices(): Promise<ServicePriceModel[]> {
    return this.servicePriceRepository.findLatestPrices();
  }

  async getLatestPricesForService(
    where: Prisma.ServicePriceWhereInput,
    {
      paging,
      order,
    }: {
      paging: { limit: number; offset: number };
      order: Prisma.ServicePriceOrderByWithRelationInput[];
    }
  ): Promise<ServicePriceModel[]> {
    return this.servicePriceRepository.findLatestPrices({
      where,
      limit: paging.limit,
      skip: paging.offset,
      orderBy: order,
    });
  }

  async getTotalLatestPricesForService(
    filters: Prisma.ServicePriceWhereInput
  ): Promise<number> {
    return this.servicePriceRepository.countLatestPrices(filters);
  }
}
