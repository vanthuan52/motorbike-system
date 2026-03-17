import { Injectable, NotFoundException } from '@nestjs/common';
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
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import { HelperService } from '@/common/helper/services/helper.service';
import { ENUM_SERVICE_PRICE_STATUS } from '../enums/service-price.enum';
import { PipelineStage } from 'mongoose';
import { VehicleServiceTableName } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { VehicleModelTableName } from '@/modules/vehicle-model/entities/vehicle-model.entity';
import { VehicleModelRepository } from '@/modules/vehicle-model/repository/vehicle-model.repository';
import { VehicleServiceRepository } from '@/modules/vehicle-service/repository/vehicle-service.repository';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_SERVICE_PRICE_STATUS_CODE_ERROR } from '../enums/service-price.status-code.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

@Injectable()
export class ServicePriceService implements IServicePriceService {
  private readonly uploadPath: string;
  constructor(
    private readonly servicePriceRepository: ServicePriceRepository,
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly vehicleServiceRepository: VehicleServiceRepository,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServicePriceDoc[]> {
    return this.servicePriceRepository.findAll<ServicePriceDoc>(find, options);
  }

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: ServicePriceDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [servicePrices, total] = await Promise.all([
      this.servicePriceRepository.findAll<ServicePriceDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: true,
      }),
      this.servicePriceRepository.getTotal(find),
    ]);

    return {
      data: servicePrices,
      total,
    };
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
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServicePriceDoc> {
    const servicePrice = await this.findOneByIdOrFail(id, options);
    return servicePrice;
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
  ): Promise<ServicePriceDoc> {
    const servicePrice =
      await this.servicePriceRepository.findOne<ServicePriceDoc>(find, options);

    if (!servicePrice) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-price.error.notFound',
      });
    }

    return servicePrice;
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
  ): Promise<DatabaseIdDto> {
    const promises: Promise<any>[] = [
      this.vehicleServiceRepository.findOneById(vehicleService),
      this.vehicleModelRepository.findOneById(vehicleModel),
    ];
    const [checkVehicleService, checkVehicleModel] =
      await Promise.all(promises);

    if (!checkVehicleService) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-service.error.notFound',
      });
    } else if (!checkVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model-type.error.notFound',
      });
    }

    const create: ServicePriceEntity = new ServicePriceEntity();
    create.price = price;
    create.vehicleService = vehicleService;
    create.vehicleModel = vehicleModel;
    create.dateStart = dateStart;
    create.dateEnd = dateEnd;
    const created =
      await this.servicePriceRepository.create<ServicePriceEntity>(
        create,
        options,
      );

    return { _id: created._id };
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
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    repository.price = price ?? repository.price;
    repository.vehicleService = vehicleService ?? repository.vehicleService;
    repository.vehicleModel = vehicleModel ?? repository.vehicleModel;
    repository.dateStart = dateStart ?? repository.dateStart;
    repository.dateEnd = dateEnd ?? repository.dateEnd;

    await this.servicePriceRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseDeleteOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.servicePriceRepository.delete({ _id: repository._id }, options);
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

  async getLatestServicePrices(): Promise<IModelServicePrice[]> {
    const pipeline: PipelineStage[] = [
      {
        $sort: {
          dateEnd: 1,
          dateStart: -1,
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: {
            vehicleService: '$vehicleService',
            vehicleModel: '$vehicleModel',
          },
          latestPriceDoc: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$latestPriceDoc' },
      },
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

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServicePriceDoc> {
    const servicePrice =
      await this.servicePriceRepository.findOneById<ServicePriceDoc>(
        id,
        options,
      );
    if (!servicePrice) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_PRICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-price.error.notFound',
      });
    }
    return servicePrice;
  }
}
