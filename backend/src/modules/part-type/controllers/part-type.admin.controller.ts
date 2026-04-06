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
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  PartTypeAdminCreateDoc,
  PartTypeAdminDeleteDoc,
  PartTypeAdminForceDeleteDoc,
  PartTypeAdminGetDoc,
  PartTypeAdminListDoc,
  PartTypeAdminRestoreDoc,
  PartTypeAdminTrashListDoc,
  PartTypeAdminUpdateDoc,
  PartTypeAdminUpdateStatusDoc,
} from '../docs/part-type.admin.doc';
import { PartTypeService } from '../services/part-type.services';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import { PartTypeUtil } from '../utils/part-type.util';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PartTypeDto } from '../dtos/part-type.dto';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { Prisma } from '@/generated/prisma-client';
import {
  PartTypeDefaultAvailableOrderBy,
  PartTypeDefaultAvailableSearch,
  PartTypeDefaultStatus,
} from '../constants/part-type.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';

@ApiTags('modules.admin.part-type')
@Controller({
  version: '1',
  path: '/part-type',
})
export class PartTypeAdminController {
  constructor(
    private readonly partTypeService: PartTypeService,
    private readonly partTypeUtil: PartTypeUtil
  ) {}

  @PartTypeAdminListDoc()
  @ResponsePaging('part-type.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.partType,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: PartTypeDefaultAvailableSearch,
      availableOrderBy: PartTypeDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    @PaginationQueryFilterInEnum('status', PartTypeDefaultStatus)
    status?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<PartTypeListResponseDto>> {
    const result = await this.partTypeService.getListOffset(pagination, {
      ...status,
    });
    const mapped = this.partTypeUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @PartTypeAdminGetDoc()
  @Response('part-type.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.partType,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<PartTypeDto>> {
    const partType = await this.partTypeService.findOneById(id);
    const mapped = this.partTypeUtil.mapOne(partType);
    return { data: mapped };
  }

  @PartTypeAdminCreateDoc()
  @Response('part-type.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.partType,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminPartTypeCreate)
  @Post('/create')
  async create(
    @Body() body: PartTypeCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const data = await this.partTypeService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      createdBy
    );
    return {
      data: { id: data.id },
      metadataActivityLog: this.partTypeUtil.mapActivityLogMetadata(data),
    };
  }

  @PartTypeAdminUpdateDoc()
  @Response('part-type.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.partType,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminPartTypeUpdate)
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: PartTypeUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.partTypeService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      updatedBy
    );
    return {
      metadataActivityLog: this.partTypeUtil.mapActivityLogMetadata(data),
    };
  }

  @PartTypeAdminUpdateStatusDoc()
  @Response('part-type.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.partType,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminPartTypeUpdateStatus)
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: PartTypeUpdateStatusRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.partTypeService.updateStatus(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      updatedBy
    );
    return {
      metadataActivityLog: this.partTypeUtil.mapActivityLogMetadata(data),
    };
  }

  @PartTypeAdminDeleteDoc()
  @Response('part-type.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.partType,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminPartTypeDelete)
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.partTypeService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {
      metadataActivityLog: this.partTypeUtil.mapActivityLogMetadata(data),
    };
  }

  // === Trash/Restore ===

  @PartTypeAdminTrashListDoc()
  @ResponsePaging('part-type.trashList')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.partType,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/trash')
  async trashList(
    @PaginationOffsetQuery({
      availableSearch: PartTypeDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >
  ): Promise<IResponsePagingReturn<PartTypeListResponseDto>> {
    const result = await this.partTypeService.getTrashList(pagination);
    const mapped = this.partTypeUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @PartTypeAdminRestoreDoc()
  @Response('part-type.restore')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.partType,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminPartTypeRestore)
  @Post('/restore/:id')
  async restore(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') restoredBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.partTypeService.restore(
      id,
      { ipAddress, userAgent, geoLocation },
      restoredBy
    );
    return {
      metadataActivityLog: this.partTypeUtil.mapActivityLogMetadata(data),
    };
  }

  @PartTypeAdminForceDeleteDoc()
  @Response('part-type.forceDelete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.partType,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminPartTypeForceDelete)
  @Delete('/force-delete/:id')
  async forceDelete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.partTypeService.forceDelete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {
      metadataActivityLog: this.partTypeUtil.mapActivityLogMetadata(data),
    };
  }
}
