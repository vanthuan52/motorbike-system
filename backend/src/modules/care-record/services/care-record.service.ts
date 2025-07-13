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
import { ENUM_SERVICE_PRICE_STATUS } from '../enums/care-record.enum';
import { PipelineStage, RootFilterQuery } from 'mongoose';
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
    create.price = price;
    create.vehicleService = vehicleService;
    create.vehicleModel = vehicleModel;
    create.dateStart = dateStart;
    create.dateEnd = dateEnd;
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
    repository.price = price ?? repository.price;
    repository.vehicleService = vehicleService ?? repository.vehicleService;
    repository.vehicleModel = vehicleModel ?? repository.vehicleModel;
    repository.dateStart = dateStart ?? repository.dateStart;
    repository.dateEnd = dateEnd ?? repository.dateEnd;
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

  async getLatestCareRecords(): Promise<IModelCareRecord[]> {
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
          CareRecordId: '$$ROOT._id',
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

    return this.CareRecordRepository.findAllAggregate<IModelCareRecord>(
      pipeline,
    );
  }

  createVehicleModelWithLatestCareRecordPipeline(
    find: Record<string, any>,
  ): PipelineStage[] {
    const serviceIdAsString = find['vehicleServiceId'] as string;

    return [
      { $match: _.omit(find, ['vehicleServiceId']) },
      {
        $lookup: {
          from: CareRecordTableName,
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
          CareRecordId: { $ifNull: ['$latestPrice._id', null] },
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
  ): Promise<IModelCareRecord[]> {
    const pipeline: PipelineStage[] =
      this.createVehicleModelWithLatestCareRecordPipeline(find);

    return this.vehicleModelRepository.findAllAggregate<IModelCareRecord>(
      pipeline,
      options,
    );
  }

  async getTotalLatestPricesForService(
    find: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    const pipeline: PipelineStage[] =
      this.createVehicleModelWithLatestCareRecordPipeline(find);

    return this.vehicleModelRepository.getTotalAggregate(pipeline, options);
  }
}
