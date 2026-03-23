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
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
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
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  SERVICE_CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_CATEGORY_DEFAULT_AVAILABLE_SEARCH,
  SERVICE_CATEGORY_DEFAULT_STATUS,
} from '../constants/service-category.list.constant';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.service-category')
@Controller({
  version: '1',
  path: '/service-category',
})
export class ServiceCategoryAdminController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
    private readonly serviceCategoryUtil: ServiceCategoryUtil,
    private readonly paginationUtil: PaginationUtil
  ) {}

  @ServiceCategoryAdminListDoc()
  @ResponsePaging('service-category.list')
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
    const { data, total } = await this.serviceCategoryService.getListOffset(
      pagination,
      status
    );
    const mapped = this.serviceCategoryUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @ServiceCategoryAdminParamsIdDoc()
  @Response('service-category.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string
  ): Promise<IResponseReturn<ServiceCategoryDto>> {
    const serviceCategory = await this.serviceCategoryService.findOneById(id);
    const mapped = this.serviceCategoryUtil.mapGet(serviceCategory);
    return { data: mapped };
  }

  @ServiceCategoryAdminCreateDoc()
  @Response('service-category.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: ServiceCategoryCreateRequestDto
  ): Promise<IResponseReturn<{ id: string }>> {
    const created = await this.serviceCategoryService.create(body);
    return { data: created };
  }

  @ServiceCategoryAdminUpdateDoc()
  @Response('service-category.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @Body() body: ServiceCategoryUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.serviceCategoryService.update(id, body);
    return {};
  }

  @ServiceCategoryAdminUpdateStatusDoc()
  @Response('service-category.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @Body() body: ServiceCategoryUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.serviceCategoryService.updateStatus(id, body);
    return {};
  }

  @ServiceCategoryAdminDeleteDoc()
  @Response('service-category.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string
  ): Promise<IResponseReturn<void>> {
    await this.serviceCategoryService.delete(id);
    return {};
  }
}
