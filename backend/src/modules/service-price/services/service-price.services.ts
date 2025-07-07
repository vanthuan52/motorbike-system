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
import { IServicePriceService } from '../interfaces/service-price.service.interface';
import { ServicePriceRepository } from '../respository/service-price.repository';
import {
  ServicePriceDoc,
  ServicePriceEntity,
  ServicePriceTableName,
} from '../entities/service-price.entity';
import {
  IModelServicePrice,
  IServicePriceDoc,
  IServicePriceEntity,
} from '../interfaces/service-price.interface';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { ServicePriceGetResponseDto } from '../dtos/response/service-price.get.response.dto';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import { ServicePriceGetFullResponseDto } from '../dtos/response/service-price.full.response.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { ENUM_SERVICE_PRICE_STATUS } from '../enums/service-price.enum';
import { PipelineStage, RootFilterQuery } from 'mongoose';
import { VehicleServiceTableName } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { VehicleModelTableName } from '@/modules/vehicle-model/entities/vehicle-model.entity';
import { VehicleModelRepository } from '@/modules/vehicle-model/repository/vehicle-model.repository';

@Injectable()
export class ServicePriceService implements IServicePriceService {
  private readonly uploadPath: string;
  constructor(
    private readonly servicePriceRepository: ServicePriceRepository,
    private readonly vehicleModelRepository: VehicleModelRepository,
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

  async delete(
    repository: ServicePriceDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<ServicePriceDoc> {
    return this.servicePriceRepository.delete({ _id: repository._id }, options);
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
    servicePrice: ServicePriceDoc | IServicePriceEntity,
  ): ServicePriceGetFullResponseDto {
    return plainToInstance(
      ServicePriceGetFullResponseDto,
      typeof (servicePrice as any).toObject === 'function'
        ? (servicePrice as any).toObject()
        : servicePrice,
    );
  }

  async getLatestServicePrices(): Promise<IModelServicePrice[]> {
    const pipeline: PipelineStage[] = [
      // Stage 1: Sort by most recent/effective prices
      {
        $sort: {
          dateEnd: 1,
          dateStart: -1,
          createdAt: -1,
        },
      },
      // Stage 2: Group by serviceId + modelId to get the latest price per pair
      {
        $group: {
          _id: {
            vehicleService: '$vehicleService',
            vehicleModel: '$vehicleModel',
          },
          latestPriceDoc: { $first: '$$ROOT' },
        },
      },

      // Stage 3: Flatten the grouped document
      {
        $replaceRoot: { newRoot: '$latestPriceDoc' },
      },

      // Stage 4: Lookup detailed info for service and model
      {
        $lookup: {
          from: VehicleServiceTableName,
          localField: 'vehicleService',
          foreignField: '_id',
          as: 'vehicleServiceInfo',
        },
      },
      {
        $unwind: '$vehicleServiceInfo',
      },
      {
        $lookup: {
          from: VehicleModelTableName,
          localField: 'vehicleModel',
          foreignField: '_id',
          as: 'vehicleModelInfo',
        },
      },
      {
        $unwind: '$vehicleModelInfo',
      },

      // Stage 5: Final projection with status field
      {
        $project: {
          _id: '$$ROOT._id',
          servicePriceId: '$$ROOT._id',
          price: '$price',
          dateStart: '$dateStart',
          dateEnd: '$dateEnd',

          vehicleServiceId: '$vehicleServiceInfo._id',
          vehicleServiceName: '$vehicleServiceInfo.name',

          vehicleModelId: '$vehicleModelInfo._id',
          vehicleModelName: '$vehicleModelInfo.fullName',

          status: {
            $cond: {
              if: {
                // dateStart <= today AND (dateEnd >= today OR dateEnd is null)
                $and: [
                  { $lte: ['$dateStart', '$$NOW'] },
                  {
                    $or: [
                      { $eq: ['$dateEnd', null] },
                      { $gte: ['$dateEnd', '$$NOW'] },
                    ],
                  },
                ],
              },
              then: ENUM_SERVICE_PRICE_STATUS.ACTIVE,
              else: {
                $cond: {
                  if: {
                    // UPCOMING: dateStart > today
                    $gt: ['$dateStart', '$$NOW'],
                  },
                  then: ENUM_SERVICE_PRICE_STATUS.UPCOMING,
                  else: ENUM_SERVICE_PRICE_STATUS.EXPIRED,
                },
              },
            },
          },
        },
      },
    ];

    return this.servicePriceRepository.findAllAggregate<IModelServicePrice>(
      pipeline,
    );
  }

  createVehicleModelWithLatestServicePricePipeline(
    find: Record<string, any>,
  ): PipelineStage[] {
    const serviceIdAsString = find['vehicleServiceId'] as string;

    return [
      { $match: _.omit(find, ['vehicleServiceId']) },
      {
        $lookup: {
          from: ServicePriceTableName,
          let: { currentModelId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$vehicleService', serviceIdAsString],
                    },
                    { $eq: ['$vehicleModel', '$$currentModelId'] },
                  ],
                },
              },
            },
            {
              $sort: {
                dateEnd: 1,
                dateStart: -1,
                createdAt: -1,
              },
            },
            { $limit: 1 },
          ],
          as: 'latestPrice',
        },
      },
      {
        $addFields: {
          latestPrice: { $arrayElemAt: ['$latestPrice', 0] },
        },
      },
      {
        $project: {
          _id: 0,
          vehicleModelId: '$_id',
          vehicleModelName: '$fullName',
          vehicleServiceId: serviceIdAsString,
          price: { $ifNull: ['$latestPrice.price', null] },
          dateStart: { $ifNull: ['$latestPrice.dateStart', null] },
          dateEnd: { $ifNull: ['$latestPrice.dateEnd', null] },
          servicePriceId: { $ifNull: ['$latestPrice._id', null] },
          status: {
            $cond: {
              if: {
                $or: [
                  { $eq: ['$latestPrice.price', null] },
                  { $not: { $ifNull: ['$latestPrice.price', false] } },
                ],
              },
              then: ENUM_SERVICE_PRICE_STATUS.NO_PRICE,
              else: {
                $cond: {
                  if: {
                    $and: [
                      { $lte: ['$latestPrice.dateStart', '$$NOW'] },
                      {
                        $or: [
                          { $eq: ['$latestPrice.dateEnd', null] },
                          { $gte: ['$latestPrice.dateEnd', '$$NOW'] },
                        ],
                      },
                    ],
                  },
                  then: ENUM_SERVICE_PRICE_STATUS.ACTIVE,
                  else: {
                    $cond: {
                      if: { $gt: ['$latestPrice.dateStart', '$$NOW'] },
                      then: ENUM_SERVICE_PRICE_STATUS.UPCOMING,
                      else: ENUM_SERVICE_PRICE_STATUS.EXPIRED,
                    },
                  },
                },
              },
            },
          },
        },
      },
    ];
  }

  async getLatestPricesForService(
    find: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IModelServicePrice[]> {
    const pipeline: PipelineStage[] =
      this.createVehicleModelWithLatestServicePricePipeline(find);

    return this.vehicleModelRepository.findAllAggregate<IModelServicePrice>(
      pipeline,
      options,
    );
  }

  async getTotalLatestPricesForService(
    find: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    const pipeline: PipelineStage[] =
      this.createVehicleModelWithLatestServicePricePipeline(find);

    return this.vehicleModelRepository.getTotalAggregate(pipeline, options);
  }
}
