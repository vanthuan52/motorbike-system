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
import { IResponseReturn, IResponsePagingReturn, } from '@/common/response/interfaces/response.interface';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { ServicePriceDto } from '../dtos/service-price.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { Prisma } from '@/generated/prisma-client';
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
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/service-price.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { IModelServicePrice } from '../interfaces/service-price.interface';
import { RequestOptionalParseUUIDPipe } from '@/common/request/pipes/request.optional-parse-uuid.pipe';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { ENUM_SERVICE_PRICE_STATUS } from '../enums/service-price.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { ServicePriceUtil } from '../utils/service-price.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

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
    private readonly servicePriceUtil: ServicePriceUtil,
    private readonly paginationUtil: PaginationUtil,
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
    @Query('vehicleService', RequestOptionalParseUUIDPipe)
    vehicleServiceId: string,
    @Query('vehicleModel', RequestOptionalParseUUIDPipe)
    vehicleModelId: string,
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
      filters,
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
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe)
    id: string,
  ): Promise<IResponseReturn<ServicePriceDto>> {
    const servicePrice = await this.servicePriceService.findOneById(id);
    return {
      data: this.servicePriceUtil.mapGet(servicePrice),
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
  @Post('/create')
  async create(
    @Body() body: ServicePriceCreateRequestDto,
  ): Promise<IResponseReturn<{ id: string }>> {
    const created = await this.servicePriceService.create(body);
    return { data: created };
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
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe)
    id: string,
    @Body() body: ServicePriceUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.servicePriceService.update(id, body);
    return {};
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
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe)
    id: string,
  ): Promise<IResponseReturn<void>> {
    await this.servicePriceService.delete(id);
    return {};
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
    { limit, skip, where }: IPaginationQueryOffsetParams,
    @Query('vehicleService', RequestOptionalParseUUIDPipe)
    vehicleServiceId: string,
    @Query('vehicleModel', RequestOptionalParseUUIDPipe)
    vehicleModelId: string,
  ): Promise<IResponsePagingReturn<ModelServicePriceListResponseDto>> {
    const find: Record<string, any> = {
      ...where,
    };

    if (vehicleServiceId) {
      find['_id'] = vehicleServiceId;
    }

    const allServices = await this.vehicleServiceService.findAll(find);

    const modelQuery = {};
    if (vehicleModelId) {
      modelQuery['_id'] = vehicleModelId;
    }

    const allModels = await this.vehicleModelService.findAll(modelQuery);

    const latestPrices: IModelServicePrice[] =
      await this.servicePriceService.getLatestServicePrices();
    const priceMap = new Map();
    latestPrices.forEach((p) =>
      priceMap.set(`${p.vehicleServiceId}_${p.vehicleModelId}`, p),
    );

    const combinedList: IModelServicePrice[] = [];
    allServices.forEach((vehicleService) => {
      allModels.forEach((vehicleModel) => {
        const key = `${vehicleService._id}_${vehicleModel._id}`;
        const existingPrice = priceMap.get(key);

        if (existingPrice) {
          combinedList.push({
            _id: existingPrice.servicePriceId,
            vehicleServiceId: vehicleService._id.toString(),
            vehicleServiceName: vehicleService.name,
            vehicleModelId: vehicleModel._id.toString(),
            vehicleModelName: vehicleModel.fullName,
            price: existingPrice.price,
            dateStart: existingPrice.dateStart,
            dateEnd: existingPrice.dateEnd,
            status: existingPrice.status,
          } as IModelServicePrice);
        } else {
          combinedList.push({
            _id: null,
            vehicleServiceId: vehicleService._id.toString(),
            vehicleServiceName: vehicleService.name,
            vehicleModelId: vehicleModel._id.toString(),
            vehicleModelName: vehicleModel.fullName,
            price: null,
            dateStart: null,
            dateEnd: null,
            status: ENUM_SERVICE_PRICE_STATUS.NO_PRICE,
          } as IModelServicePrice);
        }
      });
    });

    const startIndex = skip;
    const endIndex = startIndex + limit;
    const paginatedList = combinedList.slice(startIndex, endIndex);

    const total: number = combinedList.length;
    const totalPage: number = Math.ceil(total / limit);

    const page1 = Math.floor(skip / limit) + 1;
    const hasNext1 = page1 < totalPage;
    const hasPrevious1 = page1 > 1;

    // Manually constructed pagination return since PaginationUtil expects total, skip, limit which we have but logic is manual
    return this.paginationUtil.formatOffset(paginatedList, total, {
      limit,
      skip,
    } as IPaginationQueryOffsetParams);
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
    pagination: IPaginationQueryOffsetParams,
  ): Promise<IResponsePagingReturn<ModelServicePriceListResponseDto>> {
    const filters: Record<string, any> = {
      vehicleServiceId,
    };

    const servicePrices: IModelServicePrice[] =
      await this.servicePriceService.getLatestPricesForService(
        pagination.where,
        {
          paging: {
            limit: pagination.limit,
            offset: pagination.skip,
          },
          order: pagination.orderBy,
        },
      );

    const total: number =
      await this.servicePriceService.getTotalLatestPricesForService(filters);

    return this.paginationUtil.formatOffset(servicePrices, total, pagination);
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
    @Param('vehicleServiceId', RequestRequiredPipe)
    vehicleServiceId: string,
    @Param('vehicleModelId', RequestRequiredPipe)
    vehicleModelId: string,
  ): Promise<IResponsePagingReturn<ServicePriceListResponseDto>> {
    const filters: Record<string, any> = {
      vehicleService: vehicleServiceId,
      vehicleModel: vehicleModelId,
    };

    const result = await this.servicePriceService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.servicePriceUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }
}
