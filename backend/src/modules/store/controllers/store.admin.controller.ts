import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  ResponsePaging,
  Response,
} from '@/common/response/decorators/response.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';

import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumStoreStatus } from '../enums/store.enum';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { StoreService } from '../services/store.services';
import { StoreDto } from '../dtos/store.dto';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';
import {
  StoreAdminCreateDoc,
  StoreAdminDeleteDoc,
  StoreAdminListDoc,
  StoreAdminParamsIdDoc,
  StoreAdminUpdateDoc,
  StoreAdminUpdateStatusDoc,
} from '../docs/store.admin.doc';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { StoreUtil } from '../utils/store.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.store')
@Controller({
  version: '1',
  path: '/store',
})
export class StoreAdminController {
  constructor(
    private readonly storeService: StoreService,
    private readonly storeUtil: StoreUtil,
    private readonly paginationUtil: PaginationUtil
  ) {}

  @StoreAdminListDoc()
  @ResponsePaging('store.list')
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
      availableSearch: ['name', 'status'],
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    @PaginationQueryFilterInEnum('status', [
      EnumStoreStatus.active,
      EnumStoreStatus.inactive,
    ])
    status: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<StoreListResponseDto>> {
    const { data, total } = await this.storeService.getListOffset(
      pagination,
      status
    );
    const mapped = this.storeUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @StoreAdminParamsIdDoc()
  @Response('store.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<StoreDto>> {
    const store = await this.storeService.findOneById(id);
    const mapped = this.storeUtil.mapOne(store);
    return { data: mapped };
  }

  @StoreAdminCreateDoc()
  @Response('store.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: StoreCreateRequestDto
  ): Promise<IResponseReturn<{ id: string }>> {
    const created = await this.storeService.create(body);
    return { data: created };
  }

  @StoreAdminUpdateDoc()
  @Response('store.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: StoreUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.storeService.update(id, body);
    return {};
  }

  @StoreAdminDeleteDoc()
  @Response('store.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<void>> {
    await this.storeService.delete(id);
    return {};
  }

  @StoreAdminUpdateStatusDoc()
  @Response('store.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: StoreUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.storeService.updateStatus(id, body);
    return {};
  }
}
