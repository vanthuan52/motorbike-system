import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceCategoryService } from '../services/service-category.services';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import { ServiceCategoryDto } from '../dtos/service-category.dto';
import { ServiceCategoryUtil } from '../utils/service-category.util';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  ServiceCategoryAdminCreateDoc,
  ServiceCategoryAdminDeleteDoc,
  ServiceCategoryAdminListDoc,
  ServiceCategoryAdminParamsIdDoc,
  ServiceCategoryAdminUpdateDoc,
  ServiceCategoryAdminUpdateStatusDoc,
} from '../docs/service-category.admin.doc';
import { EnumServiceCategoryStatusCodeError } from '../enums/service-category.status-code.enum';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  SERVICE_CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_CATEGORY_DEFAULT_AVAILABLE_SEARCH,
  SERVICE_CATEGORY_DEFAULT_STATUS,
} from '../constants/service-category.list.constant';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
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
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.service-category')
@Controller({
  version: '1',
  path: '/service-category',
})
export class ServiceCategoryAdminController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
    private readonly serviceCategoryUtil: ServiceCategoryUtil
  ) {}

  @ServiceCategoryAdminListDoc()
  @ResponsePaging('service-category.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceCategory,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: SERVICE_CATEGORY_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceCategorySelect,
      Prisma.ServiceCategoryWhereInput
    >,
    @PaginationQueryFilterInEnum('status', SERVICE_CATEGORY_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<ServiceCategoryListResponseDto>> {
    const result = await this.serviceCategoryService.getListOffset(
      pagination,
      status
    );
    const mapped = this.serviceCategoryUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @ServiceCategoryAdminParamsIdDoc()
  @Response('service-category.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceCategory,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<ServiceCategoryDto>> {
    const serviceCategory = await this.serviceCategoryService.findOneById(id);
    const mapped = this.serviceCategoryUtil.mapGet(serviceCategory);
    return { data: mapped };
  }

  @ServiceCategoryAdminCreateDoc()
  @Response('service-category.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceCategory,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: ServiceCategoryCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<{ id: string }>> {
    const created = await this.serviceCategoryService.create(
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      createdBy
    );
    return { data: created };
  }

  @ServiceCategoryAdminUpdateDoc()
  @Response('service-category.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceCategory,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: ServiceCategoryUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.serviceCategoryService.update(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {};
  }

  @ServiceCategoryAdminUpdateStatusDoc()
  @Response('service-category.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceCategory,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: ServiceCategoryUpdateStatusRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.serviceCategoryService.updateStatus(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {};
  }

  @ServiceCategoryAdminDeleteDoc()
  @Response('service-category.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceCategory,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.serviceCategoryService.delete(
      id,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
    return {};
  }
}
