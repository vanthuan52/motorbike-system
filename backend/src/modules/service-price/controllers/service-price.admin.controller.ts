import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicePriceService } from '../services/service-price.services';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';

import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { ServicePriceDto } from '../dtos/service-price.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { AuthJwtPayload } from '@/modules/auth/decorators/auth.jwt.decorator';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import {
  ServicePriceAdminCreateDoc,
  ServicePriceAdminDeleteDoc,
  ServicePriceAdminListCombinedByServiceDoc,
  ServicePriceAdminListCombinedDoc,
  ServicePriceAdminListDoc,
  ServicePriceAdminListHistoryDoc,
  ServicePriceAdminParamsIdDoc,
  ServicePriceAdminUpdateDoc,
} from '../docs/service-price.admin.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/service-price.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { IModelServicePrice } from '../interfaces/service-price.interface';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { EnumServicePriceStatus } from '../enums/service-price.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { ServicePriceUtil } from '../utils/service-price.util';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.service-price')
@Controller({
  version: '1',
  path: '/service-price',
})
export class ServicePriceAdminController {
  private readonly logger = new Logger(ServicePriceAdminController.name);
  constructor(
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly servicePriceService: ServicePriceService,
    private readonly servicePriceUtil: ServicePriceUtil
  ) {}

  @ServicePriceAdminListDoc()
  @ResponsePaging('service-price.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServicePriceSelect,
      Prisma.ServicePriceWhereInput
    >,
    @Query('vehicleService', RequestOptionalParseObjectIdPipe)
    vehicleServiceId: string,
    @Query('vehicleModel', RequestOptionalParseObjectIdPipe)
    vehicleModelId: string
  ): Promise<IResponsePagingReturn<ServicePriceListResponseDto>> {
    const filters: Prisma.ServicePriceWhereInput = {};

    if (vehicleServiceId) {
      filters.vehicleServiceId = vehicleServiceId;
    }

    if (vehicleModelId) {
      filters.vehicleModelId = vehicleModelId;
    }

    const result = await this.servicePriceService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.servicePriceUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @ServicePriceAdminParamsIdDoc()
  @Response('service-price.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    id: string
  ): Promise<IResponseReturn<ServicePriceDto>> {
    const servicePrice = await this.servicePriceService.findOneById(id);
    return {
      data: this.servicePriceUtil.mapOne(servicePrice),
    };
  }

  @ServicePriceAdminCreateDoc()
  @Response('service-price.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminServicePriceCreate)
  @Post('/create')
  async create(
    @Body() body: ServicePriceCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<{ id: string }>> {
    return this.servicePriceService.create(
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      createdBy
    );
  }

  @ServicePriceAdminUpdateDoc()
  @Response('service-price.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminServicePriceUpdate)
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    id: string,
    @Body() body: ServicePriceUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.servicePriceService.update(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
  }

  @ServicePriceAdminDeleteDoc()
  @Response('service-price.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminServicePriceDelete)
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.servicePriceService.delete(
      id,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
  }

  @ServicePriceAdminListCombinedDoc()
  @ResponsePaging('service-price.listByService')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/combined')
  async listServicePriceCombined(
    @PaginationOffsetQuery({
      availableSearch: SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('vehicleService', RequestOptionalParseObjectIdPipe)
    vehicleServiceId: string,
    @Query('vehicleModel', RequestOptionalParseObjectIdPipe)
    vehicleModelId: string
  ): Promise<IResponsePagingReturn<ServicePriceListResponseDto>> {
    const { limit, skip, where } = pagination;
    const find: Record<string, any> = {
      ...where,
    };

    if (vehicleServiceId) {
      find['id'] = vehicleServiceId;
    }

    const allServices = await this.vehicleServiceService.findAll(find);

    const modelQuery: Record<string, any> = {};
    if (vehicleModelId) {
      modelQuery['id'] = vehicleModelId;
    }

    const allModels = await this.vehicleModelService.findAll(modelQuery);

    const latestPrices =
      await this.servicePriceService.getLatestServicePrices();
    const priceMap = new Map();
    latestPrices.forEach(p =>
      priceMap.set(`${p.vehicleServiceId}_${p.vehicleModelId}`, p)
    );

    const combinedList: IModelServicePrice[] = [];
    allServices.forEach(vehicleService => {
      allModels.forEach(vehicleModel => {
        const key = `${vehicleService.id}_${vehicleModel.id}`;
        const existingPrice = priceMap.get(key);

        if (existingPrice) {
          combinedList.push({
            _id: existingPrice.id,
            servicePriceId: existingPrice.id,
            vehicleServiceId: vehicleService.id,
            vehicleServiceName: vehicleService.name,
            vehicleModelId: vehicleModel.id,
            vehicleModelName: vehicleModel.fullName,
            price: existingPrice.price,
            dateStart: existingPrice.dateStart,
            dateEnd: existingPrice.dateEnd,
            status: existingPrice.status as any,
          } as IModelServicePrice);
        } else {
          combinedList.push({
            _id: null,
            vehicleServiceId: vehicleService.id,
            vehicleServiceName: vehicleService.name,
            vehicleModelId: vehicleModel.id,
            vehicleModelName: vehicleModel.fullName,
            price: null,
            dateStart: null,
            dateEnd: null,
            status: EnumServicePriceStatus.noPrice as any,
          } as IModelServicePrice);
        }
      });
    });

    const startIndex = skip;
    const endIndex = startIndex + limit;
    const paginatedList = combinedList.slice(startIndex, endIndex);

    const total: number = combinedList.length;

    return {
      type: pagination.type,
      count: total,
      perPage: limit,
      page: Math.floor(skip / limit) + 1,
      totalPage: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrevious: skip > 0,
      data: paginatedList as any,
    };
  }

  @ServicePriceAdminListCombinedByServiceDoc()
  @ResponsePaging('service-price.listByService')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/for-service/:vehicleServiceId')
  async listByVehicleService(
    @Param('vehicleServiceId', RequestRequiredPipe)
    vehicleServiceId: string,
    @PaginationOffsetQuery({
      availableSearch: SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams
  ): Promise<IResponsePagingReturn<ServicePriceListResponseDto>> {
    const filters: Prisma.ServicePriceWhereInput = {
      vehicleServiceId,
    };

    const servicePrices =
      await this.servicePriceService.getLatestPricesForService(
        pagination.where,
        {
          paging: {
            limit: pagination.limit,
            offset: pagination.skip,
          },
          order: pagination.orderBy as any,
        }
      );

    const total: number =
      await this.servicePriceService.getTotalLatestPricesForService(filters);

    return {
      type: EnumPaginationType.offset,
      count: total,
      perPage: pagination.limit,
      page: Math.floor(pagination.skip / pagination.limit) + 1,
      totalPage: Math.ceil(total / pagination.limit),
      hasNext: pagination.skip + pagination.limit < total,
      hasPrevious: pagination.skip > 0,
      data: servicePrices as any,
    };
  }

  @ServicePriceAdminListHistoryDoc()
  @ResponsePaging('service-price.listHistory')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/history/:vehicleServiceId/:vehicleModelId')
  async listHistory(
    @PaginationOffsetQuery({
      availableSearch: SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Param('vehicleServiceId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    vehicleServiceId: string,
    @Param('vehicleModelId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    vehicleModelId: string
  ): Promise<IResponsePagingReturn<ServicePriceListResponseDto>> {
    const filters: Record<string, any> = {
      vehicleService: vehicleServiceId,
      vehicleModel: vehicleModelId,
    };

    const result = await this.servicePriceService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.servicePriceUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }
}
