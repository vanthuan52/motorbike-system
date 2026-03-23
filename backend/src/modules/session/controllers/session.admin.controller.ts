import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterEqualBoolean,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationEqual,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
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
import { SessionDefaultAvailableOrderBy } from '@/modules/session/constants/session.list.constant';
import {
  SessionAdminListDoc,
  SessionAdminRevokeDoc,
} from '@/modules/session/docs/session.admin.doc';
import { SessionResponseDto } from '@/modules/session/dtos/response/session.response.dto';
import { SessionService } from '@/modules/session/services/session.service';
import { SessionUtil } from '@/modules/session/utils/session.util';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

import {
  EnumActivityLogAction,
  EnumRoleType,
  GeoLocation,
  Prisma,
  UserAgent,
} from '@/generated/prisma-client';

@ApiTags('modules.admin.user.session')
@Controller({
  version: '1',
  path: '/user/:userId/session',
})
export class SessionAdminController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionUtil: SessionUtil,
    private readonly paginationUtil: PaginationUtil
  ) {}

  @SessionAdminListDoc()
  @ResponsePaging('session.list')
  @PolicyAbilityProtected(
    {
      subject: EnumPolicySubject.user,
      action: [EnumPolicyAction.read],
    },
    {
      subject: EnumPolicySubject.session,
      action: [EnumPolicyAction.read],
    }
  )
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableOrderBy: SessionDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >,
    @Param('userId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    userId: string,
    @PaginationQueryFilterEqualBoolean('isRevoked')
    isRevoked?: Record<string, IPaginationEqual>
  ): Promise<IResponsePagingReturn<SessionResponseDto>> {
    const { data, total } = await this.sessionService.getListOffsetByAdmin(
      userId,
      pagination,
      isRevoked
    );
    const mapped = this.sessionUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @SessionAdminRevokeDoc()
  @Response('session.revoke')
  @PolicyAbilityProtected(
    {
      subject: EnumPolicySubject.user,
      action: [EnumPolicyAction.read],
    },
    {
      subject: EnumPolicySubject.session,
      action: [EnumPolicyAction.read, EnumPolicyAction.delete],
    }
  )
  @RoleProtected(EnumRoleType.admin)
  @ActivityLog(EnumActivityLogAction.adminSessionRevoke)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/revoke/:sessionId')
  async revoke(
    @Param('userId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    userId: string,
    @Param('sessionId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    sessionId: string,
    @AuthJwtPayload('userId') revokedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const removed = await this.sessionService.revokeByAdmin(
      userId,
      sessionId,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      revokedBy
    );
    return {
      metadataActivityLog: this.sessionUtil.mapActivityLogMetadata(removed),
    };
  }
}
