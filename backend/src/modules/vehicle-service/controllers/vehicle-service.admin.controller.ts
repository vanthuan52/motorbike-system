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
  ParseUUIDPipe,
  Optional,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import { VehicleServiceGetResponseDto } from '../dtos/response/vehicle-service.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { ENUM_VEHICLE_SERVICE_STATUS } from '../enums/vehicle-service.enum';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  VehicleServiceAdminCreateDoc,
  VehicleServiceAdminDeleteDoc,
  VehicleServiceAdminGetDoc,
  VehicleServiceAdminListDoc,
  VehicleServiceAdminUpdateDoc,
  VehicleServiceAdminUpdateStatusDoc,
} from '../docs/vehicle-service.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR } from '../enums/vehicle-service.status-code.enum';
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
import { VehicleServiceDoc } from '../entities/vehicle-service.entity';
import {
  VEHICLE_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_SERVICE_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_SERVICE_DEFAULT_STATUS,
} from '../constants/vehicle-service.list.constant';
import { VehicleServiceService } from '../services/vehicle-service.service';
import { ServiceCategoryService } from '@/modules/service-category/services/service-category.services';
import {
  IVehicleServiceDoc,
  IVehicleServiceEntity,
} from '../interfaces/vehicle-service.interface';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { VehicleServiceParsePipe } from '../pipes/vehicle-service.parse.pipe';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';

@ApiTags('modules.admin.vehicle-service')
@Controller({
  version: '1',
  path: '/vehicle-service',
})
export class VehicleServiceAdminController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly paginationService: PaginationService,
  ) {}

  @VehicleServiceAdminListDoc()
  @ResponsePaging('vehicle-service.list')
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
      availableSearch: VEHICLE_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      VEHICLE_SERVICE_DEFAULT_STATUS,
      ENUM_VEHICLE_SERVICE_STATUS,
    )
    status: Record<string, any>,
    @Query('serviceCategory', OptionalParseUUIDPipe)
    serviceCategoryId: string,
  ): Promise<IResponsePaging<VehicleServiceListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    if (serviceCategoryId) {
      find['serviceCategory._id'] = serviceCategoryId;
    }

    const vehicleServices: IVehicleServiceEntity[] =
      await this.vehicleServiceService.findAllWithServiceCategory(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number =
      await this.vehicleServiceService.getTotalWithServiceCategory(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.vehicleServiceService.mapList(vehicleServices);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @VehicleServiceAdminGetDoc()
  @Response('vehicle-service.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, VehicleServiceParsePipe)
    vehicleService: VehicleServiceDoc,
  ): Promise<IResponse<VehicleServiceGetResponseDto>> {
    const vehicleServiceWithCategory: IVehicleServiceDoc =
      await this.vehicleServiceService.join(vehicleService);
    const mapped: VehicleServiceGetResponseDto =
      this.vehicleServiceService.mapGet(vehicleServiceWithCategory);
    return { data: mapped };
  }

  @VehicleServiceAdminCreateDoc()
  @Response('vehicle-service.create')
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
    @Body() body: VehicleServiceCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.serviceCategoryService.findOneById(body.serviceCategory),
      this.vehicleServiceService.existBySlug(body.slug),
    ];

    const [checkServiceCategory, slugExist] = await Promise.all(promises);

    if (!checkServiceCategory) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-category.error.notFound',
      });
    } else if (slugExist) {
      throw new ConflictException({
        statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.SLUG_EXISTED,
        message: 'vehicle-service.error.slugExisted',
      });
    }

    try {
      const created = await this.vehicleServiceService.create(body, {
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

  @VehicleServiceAdminUpdateDoc()
  @Response('vehicle-service.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, VehicleServiceParsePipe)
    vehicleService: VehicleServiceDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: VehicleServiceUpdateRequestDto,
  ): Promise<void> {
    if (body.slug && body.slug !== vehicleService.slug) {
      const existingBySlug = await this.vehicleServiceService.findOne({
        slug: body.slug,
      });

      if (
        existingBySlug &&
        existingBySlug._id.toString() !== vehicleService._id.toString()
      ) {
        throw new ConflictException({
          statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'vehicle-service.error.slugExisted',
        });
      }
    }
    try {
      await this.vehicleServiceService.update(vehicleService, body, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @VehicleServiceAdminUpdateStatusDoc()
  @Response('vehicle-service.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, VehicleServiceParsePipe)
    vehicleService: VehicleServiceDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: VehicleServiceUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.vehicleServiceService.updateStatus(
        vehicleService,
        { status },
        { actionBy: updatedBy } as IDatabaseSaveOptions,
      );
      return {
        _metadata: {
          customProperty: {
            messageProperties: {
              status: status.toLowerCase(),
            },
          },
        },
      };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'vehicle-service.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @VehicleServiceAdminDeleteDoc()
  @Response('vehicle-service.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, VehicleServiceParsePipe)
    vehicleService: VehicleServiceDoc,
    @AuthJwtPayload('user') updatedBy: string,
  ): Promise<IResponse<void>> {
    try {
      await this.vehicleServiceService.softDelete(vehicleService, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'vehicle-service.error.deleteFailed',
        _error: err,
      });
    }
  }
}
