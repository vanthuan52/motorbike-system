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
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
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
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { StoreService } from '../services/store.services';
import { StoreDto } from '../dtos/store.dto';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
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
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import {
  StoreDefaultAvailableSearch,
  StoreDefaultStatus,
} from '../constants/store.constant';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.store')
@Controller({
  version: '1',
  path: '/store',
})
export class StoreAdminController {
  constructor(
    private readonly storeService: StoreService,
    private readonly storeUtil: StoreUtil
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
      availableSearch: StoreDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.StoreSelect,
      Prisma.StoreWhereInput
    >,
    @PaginationQueryFilterInEnum('status', StoreDefaultStatus)
    status?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<StoreListResponseDto>> {
    const result = await this.storeService.getListOffset(pagination, status);
    const mapped = this.storeUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
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
  @Get('/get/:storeId')
  async get(
    @Param('storeId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    storeId: string
  ): Promise<IResponseReturn<StoreDto>> {
    const store = await this.storeService.findOneById(storeId);
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
    @Body() body: StoreCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.storeService.create(
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

  @StoreAdminUpdateDoc()
  @Response('store.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:storeId')
  async update(
    @Param('storeId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    storeId: string,
    @Body() body: StoreUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.storeService.update(
      storeId,
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

  @StoreAdminDeleteDoc()
  @Response('store.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:storeId')
  async delete(
    @Param('storeId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    storeId: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.storeService.delete(
      storeId,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
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
  @Patch('/update/:storeId/status')
  async updateStatus(
    @Param('storeId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    storeId: string,
    @Body() body: StoreUpdateStatusRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.storeService.updateStatus(
      storeId,
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
}
