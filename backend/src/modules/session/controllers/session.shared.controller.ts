import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationCursorQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { RequestUserAgentDto } from '@/common/request/dtos/request.user-agent.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { SessionDefaultAvailableOrderBy } from '@/modules/session/constants/session.list.constant';
import {
  SessionSharedListDoc,
  SessionSharedRevokeDoc,
} from '@/modules/session/docs/session.shared.doc';
import { SessionListResponseDto } from '@/modules/session/dtos/response/session.list.response.dto';
import { SessionService } from '@/modules/session/services/session.service';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { SessionUtil } from '../utils/session.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

@ApiTags('modules.shared.user.session')
@Controller({
  version: '1',
  path: '/user/session',
})
export class SessionSharedController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionUtil: SessionUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @SessionSharedListDoc()
  @ResponsePaging('session.list')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @AuthJwtPayload('userId') userId: string,
    @PaginationCursorQuery({
      availableOrderBy: SessionDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryCursorParams,
  ): Promise<IResponsePagingReturn<SessionListResponseDto>> {
    const { data, total } = await this.sessionService.getListCursor(
      userId,
      pagination,
    );
    const mappedData = this.sessionUtil.mapList(data);

    return this.paginationUtil.formatCursor(mappedData, total, pagination);
  }

  @SessionSharedRevokeDoc()
  @ResponsePaging('session.revoke')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/revoke/:sessionId')
  async revoke(
    @Param('sessionId', RequestRequiredPipe, RequestIsValidUuidPipe)
    sessionId: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: RequestUserAgentDto,
  ): Promise<IResponseReturn<void>> {
    const requestLog: IRequestLog = {
      ipAddress,
      userAgent,
    };

    await this.sessionService.revoke(userId, sessionId, requestLog);
    return {};
  }
}
