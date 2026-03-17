import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionService } from '../services/session.service';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import {
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { RequestUserAgentDto } from '@/common/request/dtos/request.user-agent.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { SessionDefaultAvailableOrderBy } from '../constants/session.list.constant';
import { SessionListResponseDto } from '../dtos/response/session.list.response.dto';
import {
  SessionAdminListDoc,
  SessionAdminRevokeDoc,
} from '../docs/session.admin.doc';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { SessionUtil } from '../utils/session.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

@ApiTags('modules.admin.user.session')
@Controller({
  version: '1',
  path: '/user/:userId/session',
})
export class SessionAdminController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionUtil: SessionUtil,
    private readonly paginationUtil: PaginationUtil,
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
    },
  )
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @Query('userId', RequestRequiredPipe, RequestIsValidUuidPipe)
    userId: string,
    @PaginationOffsetQuery({
      availableOrderBy: SessionDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('status') status?: string[],
  ): Promise<IResponsePagingReturn<SessionListResponseDto>> {
    const filterStatus = status ? { status: { $in: status } } : {};
    const { data, total } = await this.sessionService.getListOffset(
      userId,
      pagination,
      filterStatus,
    );
    const mappedData = this.sessionUtil.mapList(data);

    return this.paginationUtil.formatOffset(mappedData, total, pagination);
  }

  @SessionAdminRevokeDoc()
  @ResponsePaging('session.revoke')
  @PolicyAbilityProtected(
    {
      subject: EnumPolicySubject.user,
      action: [EnumPolicyAction.read],
    },
    {
      subject: EnumPolicySubject.session,
      action: [EnumPolicyAction.read, EnumPolicyAction.delete],
    },
  )
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/revoke/:sessionId')
  async revoke(
    @Param('sessionId', RequestRequiredPipe, RequestIsValidUuidPipe)
    sessionId: string,
    @Query('userId', RequestRequiredPipe, RequestIsValidUuidPipe)
    userId: string,
    @AuthJwtPayload('userId') revokeBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: RequestUserAgentDto,
  ): Promise<IResponseReturn<void>> {
    const requestLog: IRequestLog = {
      ipAddress,
      userAgent,
    };
    await this.sessionService.revokeByAdmin(
      userId,
      sessionId,
      requestLog,
      revokeBy,
    );

    return {};
  }
}
