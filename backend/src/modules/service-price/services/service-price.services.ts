import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicePriceRepository } from '../respository/service-price.repository';
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
import { ServicePrice, Prisma } from '@/generated/prisma-client';

@Injectable()
export class ServicePriceService implements IServicePriceService {
  constructor(
    private readonly servicePriceRepository: ServicePriceRepository,
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly vehicleServiceRepository: VehicleServiceRepository
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
  ): Promise<IPaginationOffsetReturn<ServicePrice>> {
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
  ): Promise<IPaginationCursorReturn<ServicePrice>> {
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

  async findOneById(id: string): Promise<ServicePrice> {
    const servicePrice = await this.servicePriceRepository.findOneById(id);
    if (!servicePrice) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-price.error.notFound',
      });
    }
    return servicePrice;
  }

  async findOne(find: Record<string, any>): Promise<ServicePrice | null> {
    return this.servicePriceRepository.findOne(find);
  }

  async create({
    price,
    vehicleService,
    vehicleModel,
    dateStart,
    dateEnd,
  }: ServicePriceCreateRequestDto): Promise<{ id: string }> {
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
    };

    const created = await this.servicePriceRepository.create(data);
    return { id: created.id };
  }

  async update(
    id: string,
    {
      price,
      vehicleService,
      vehicleModel,
      dateStart,
      dateEnd,
    }: ServicePriceUpdateRequestDto
  ): Promise<void> {
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
    };

    await this.servicePriceRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const servicePrice = await this.servicePriceRepository.findOneById(id);
    if (!servicePrice) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-price.error.notFound',
      });
    }

    await this.servicePriceRepository.delete(id);
  }
}
