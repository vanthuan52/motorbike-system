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
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleBrandService } from '../services/vehicle-brand.service';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandGetResponseDto } from '../dtos/response/vehicle-brand.get.response.dto';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { ENUM_VEHICLE_BRAND_STATUS } from '../enums/vehicle-brand.enum';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  VehicleBrandAdminCreateDoc,
  VehicleBrandAdminDeleteDoc,
  VehicleBrandAdminListDoc,
  VehicleBrandAdminParamsIdDoc,
  VehicleBrandAdminUpdateDoc,
  VehicleBrandAdminUpdateStatusDoc,
} from '../docs/vehicle-brand.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR } from '../enums/vehicle-brand.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
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
  VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_BRAND_DEFAULT_STATUS,
} from '../constants/vehicle-brand.list.constant';

@ApiTags('modules.admin.vehicle-brand')
@Controller({
  version: '1',
  path: '/vehicle-brand',
})
export class VehicleBrandAdminController {
  constructor(
    private readonly VehicleBrandService: VehicleBrandService,
    private readonly paginationService: PaginationService,
  ) {}

  @VehicleBrandAdminListDoc()
  @ResponsePaging('vehicle-brand.list')
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
      availableSearch: VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      VEHICLE_BRAND_DEFAULT_STATUS,
      ENUM_VEHICLE_BRAND_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<VehicleBrandListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const vehicleBrands = await this.VehicleBrandService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.VehicleBrandService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.VehicleBrandService.mapList(vehicleBrands);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @VehicleBrandAdminParamsIdDoc()
  @Response('vehicle-brand.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id') id: string,
  ): Promise<IResponse<VehicleBrandGetResponseDto>> {
    const vehicleBrand = await this.VehicleBrandService.findOneById(id);
    if (!vehicleBrand) {
      throw new NotFoundException({
        message: 'vehicle-brand.error.notFound',
      });
    }
    const mapped = this.VehicleBrandService.mapGet(vehicleBrand);
    return { data: mapped };
  }

  @VehicleBrandAdminCreateDoc()
  @Response('vehicle-brand.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: VehicleBrandCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    try {
      const existingVehicleBrand = await this.VehicleBrandService.findBySlug(
        body.slug,
      );
      if (existingVehicleBrand) {
        throw new InternalServerErrorException({
          statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'vehicle-brand.error.slugExisted',
        });
      }

      const created = await this.VehicleBrandService.create(body);
      return { data: { _id: created._id } };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException({
        message: 'vehicle-brand.error.createFailed',
        _error: err,
      });
    }
  }

  @VehicleBrandAdminUpdateDoc()
  @Response('vehicle-brand.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: VehicleBrandUpdateRequestDto,
  ): Promise<void> {
    const vehicleBrand = await this.VehicleBrandService.findOneById(id);

    if (!vehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    }

    if (body.slug && body.slug !== vehicleBrand.slug) {
      const existingBySlug = await this.VehicleBrandService.findOne({
        slug: body.slug,
      });

      if (
        existingBySlug &&
        existingBySlug._id.toString() !== vehicleBrand._id.toString()
      ) {
        throw new ConflictException({
          statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'vehicle-brand.error.slugExisted',
        });
      }
    }
    try {
      await this.VehicleBrandService.update(vehicleBrand, body);
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'vehicle-brand.error.updateFailed',
        _error: err,
      });
    }
  }

  @VehicleBrandAdminUpdateStatusDoc()
  @Response('vehicle-brand.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: VehicleBrandUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    const VehicleBrand = await this.VehicleBrandService.findOneById(id);
    if (!VehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    }
    try {
      await this.VehicleBrandService.updateStatus(
        VehicleBrand,
        { status },
        {} as IDatabaseSaveOptions,
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
        message: 'vehicle-brand.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @VehicleBrandAdminDeleteDoc()
  @Response('vehicle-brand.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<IResponse<void>> {
    const VehicleBrand = await this.VehicleBrandService.findOneById(id);
    if (!VehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    }
    try {
      await this.VehicleBrandService.softDelete(VehicleBrand);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'vehicle-brand.error.deleteFailed',
        _error: err,
      });
    }
  }
}
