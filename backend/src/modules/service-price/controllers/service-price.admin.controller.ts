import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicePriceService } from '../services/service-price.services';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { ServicePriceGetResponseDto } from '../dtos/response/service-price.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  ServicePriceAdminCreateDoc,
  ServicePriceAdminDeleteDoc,
  ServicePriceAdminListDoc,
  ServicePriceAdminParamsIdDoc,
  ServicePriceAdminUpdateDoc,
} from '../docs/service-price.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_SERVICE_PRICE_STATUS_CODE_ERROR } from '../enums/service-price.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import {
  SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
  SERVICE_PRICE_DEFAULT_STATUS,
} from '../constants/service-price.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { ServicePriceParsePipe } from '../pipes/service-price.parse.pipe';
import { ServicePriceDoc } from '../entities/service-price.entity';
import { IServicePriceDoc } from '../interfaces/service-price.interface';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';

@ApiTags('modules.admin.service-price')
@Controller({
  version: '1',
  path: '/service-price',
})
export class ServicePriceAdminController {
  constructor(
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly servicePriceService: ServicePriceService,
    private readonly paginationService: PaginationService,
  ) {}

  @ServicePriceAdminListDoc()
  @ResponsePaging('service-price.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: SERVICE_PRICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_PRICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('vehicleService', OptionalParseUUIDPipe)
    vehicleServiceId: string,
    @Query('vehicleModel', OptionalParseUUIDPipe)
    vehicleModelId: string,
  ): Promise<IResponsePaging<ServicePriceListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    if (vehicleServiceId) {
      find['vehicleService'] = vehicleServiceId;
    }

    if (vehicleModelId) {
      find['vehicleModel'] = vehicleModelId;
    }

    const ServicePrices =
      await this.servicePriceService.findAllWithVehicleServiceAndVehicleModel(
        find,
        {
          paging: {
            limit: _limit,
            offset: _offset,
          },
          order: _order,
        },
      );

    const total: number =
      await this.servicePriceService.getTotalWithVehicleServiceAndVehicleModel(
        find,
      );

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.servicePriceService.mapList(ServicePrices);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @ServicePriceAdminParamsIdDoc()
  @Response('service-price.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, ServicePriceParsePipe)
    servicePrice: ServicePriceDoc,
  ): Promise<IResponse<ServicePriceGetResponseDto>> {
    const servicePriceFull: IServicePriceDoc =
      await this.servicePriceService.join(servicePrice);

    const mapped: ServicePriceGetResponseDto =
      this.servicePriceService.mapGet(servicePriceFull);
    return { data: mapped };
  }

  @ServicePriceAdminCreateDoc()
  @Response('service-price.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: ServicePriceCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.vehicleServiceService.findOneById(body.vehicleService),
      this.vehicleModelService.findOneById(body.vehicleModel),
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

    try {
      const created = await this.servicePriceService.create(body, {
        actionBy: createdBy,
      } as IDatabaseCreateOptions);
      return { data: { _id: created._id } };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @ServicePriceAdminUpdateDoc()
  @Response('service-price.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, ServicePriceParsePipe)
    servicePrice: ServicePriceDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: ServicePriceUpdateRequestDto,
  ): Promise<void> {
    try {
      await this.servicePriceService.update(servicePrice, body);
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @ServicePriceAdminDeleteDoc()
  @Response('service-price.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, ServicePriceParsePipe)
    servicePrice: ServicePriceDoc,
    @AuthJwtPayload('user') updatedBy: string,
  ): Promise<IResponse<void>> {
    try {
      await this.servicePriceService.softDelete(servicePrice, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'service-price.error.deleteFailed',
        _error: err,
      });
    }
  }
}
