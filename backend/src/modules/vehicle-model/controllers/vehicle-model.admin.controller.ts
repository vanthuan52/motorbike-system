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
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { VehicleModelGetResponseDto } from '../dtos/response/vehicle-model.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
} from '../enums/vehicle-model.enum';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  VehicleModelAdminCreateDoc,
  VehicleModelAdminDeleteDoc,
  VehicleModelAdminGetDoc,
  VehicleModelAdminListDoc,
  VehicleModelAdminUpdateDoc,
  VehicleModelAdminUpdateStatusDoc,
} from '../docs/vehicle-model.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '../enums/vehicle-model.status-code.enum';
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
import { VehicleModelDoc } from '../entities/vehicle-model.entity';
import {
  VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_MODEL_DEFAULT_FUEL_TYPE,
  VEHICLE_MODEL_DEFAULT_STATUS,
  VEHICLE_MODEL_DEFAULT_TYPE,
} from '../constants/vehicle-model.list.constant';
import { VehicleModelService } from '../services/vehicle-model.service';
import {
  IVehicleModelDoc,
  IVehicleModelEntity,
} from '../interfaces/vehicle-model.interface';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { VehicleModelParsePipe } from '../pipes/vehicle-model.parse.pipe';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';

@ApiTags('modules.admin.vehicle-model')
@Controller({
  version: '1',
  path: '/vehicle-model',
})
export class VehicleModelAdminController {
  constructor(
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly paginationService: PaginationService,
  ) {}

  @VehicleModelAdminListDoc()
  @ResponsePaging('vehicle-model.list')
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
      availableSearch: VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      VEHICLE_MODEL_DEFAULT_STATUS,
      ENUM_VEHICLE_MODEL_STATUS,
    )
    status: Record<string, any>,
    @PaginationQueryFilterInEnum(
      'type',
      VEHICLE_MODEL_DEFAULT_TYPE,
      ENUM_VEHICLE_MODEL_TYPE,
    )
    type: Record<string, any>,
    @PaginationQueryFilterInEnum(
      'fuelType',
      VEHICLE_MODEL_DEFAULT_FUEL_TYPE,
      ENUM_VEHICLE_MODEL_FUEL_TYPE,
    )
    fuelType: Record<string, any>,
    @Query('vehicleBrand', OptionalParseUUIDPipe)
    vehicleBrandId: string,
  ): Promise<IResponsePaging<VehicleModelListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
      ...type,
      ...fuelType,
    };

    if (vehicleBrandId) {
      find['vehicleBrand._id'] = vehicleBrandId;
    }

    const vehicleModels: IVehicleModelEntity[] =
      await this.vehicleModelService.findAllWithVehicleBrand(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number =
      await this.vehicleModelService.getTotalWithVehicleBrand(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.vehicleModelService.mapList(vehicleModels);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @VehicleModelAdminGetDoc()
  @Response('vehicle-model.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, VehicleModelParsePipe)
    vehicleModel: VehicleModelDoc,
  ): Promise<IResponse<VehicleModelGetResponseDto>> {
    const vehicleModelWithBrand: IVehicleModelDoc =
      await this.vehicleModelService.join(vehicleModel);
    const mapped: VehicleModelGetResponseDto = this.vehicleModelService.mapGet(
      vehicleModelWithBrand,
    );
    return { data: mapped };
  }

  @VehicleModelAdminCreateDoc()
  @Response('vehicle-model.create')
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
    @Body() body: VehicleModelCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.vehicleBrandService.findOneById(body.vehicleBrand),
      this.vehicleModelService.existBySlug(body.slug),
    ];

    const [checkVehicleBrand, slugExist] = await Promise.all(promises);

    if (!checkVehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    } else if (slugExist) {
      throw new ConflictException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.SLUG_EXISTED,
        message: 'vehicle-model.error.slugExisted',
      });
    }

    try {
      const created = await this.vehicleModelService.create(body, {
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

  @VehicleModelAdminUpdateDoc()
  @Response('vehicle-model.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, VehicleModelParsePipe)
    vehicleModel: VehicleModelDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: VehicleModelUpdateRequestDto,
  ): Promise<void> {
    if (body.slug && body.slug !== vehicleModel.slug) {
      const existingBySlug = await this.vehicleModelService.findOne({
        slug: body.slug,
      });

      if (
        existingBySlug &&
        existingBySlug._id.toString() !== vehicleModel._id.toString()
      ) {
        throw new ConflictException({
          statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'vehicle-model.error.slugExisted',
        });
      }
    }
    try {
      await this.vehicleModelService.update(vehicleModel, body, {
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

  @VehicleModelAdminUpdateStatusDoc()
  @Response('vehicle-model.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, VehicleModelParsePipe)
    vehicleModel: VehicleModelDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: VehicleModelUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.vehicleModelService.updateStatus(vehicleModel, { status }, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
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
        message: 'vehicle-model.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @VehicleModelAdminDeleteDoc()
  @Response('vehicle-model.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, VehicleModelParsePipe)
    vehicleModel: VehicleModelDoc,
    @AuthJwtPayload('user') updatedBy: string,
  ): Promise<IResponse<void>> {
    try {
      await this.vehicleModelService.softDelete(vehicleModel, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'vehicle-model.error.deleteFailed',
        _error: err,
      });
    }
  }
}
