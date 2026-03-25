import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationCursorQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';
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
import { SessionResponseDto } from '@/modules/session/dtos/response/session.response.dto';
import { SessionService } from '@/modules/session/services/session.service';
import { SessionUtil } from '@/modules/session/utils/session.util';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.shared.user.session')
@Controller({
  version: '1',
  path: '/user/session',
})
export class SessionSharedController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionUtil: SessionUtil,
    private readonly paginationUtil: PaginationUtil
  ) {}

  @SessionSharedListDoc()
  @ResponsePaging('session.list')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationCursorQuery({
      availableOrderBy: SessionDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryCursorParams<
      Prisma.SessionSelect,
      Prisma.SessionWhereInput
    >,
    @AuthJwtPayload('userId') userId: string
  ): Promise<IResponsePagingReturn<SessionResponseDto>> {
    const { data, total } = await this.sessionService.getListCursor(
      userId,
      pagination
    );
    const mapped = this.sessionUtil.mapList(data);
    return this.paginationUtil.formatCursor(mapped, total, pagination);
  }

  @SessionSharedRevokeDoc()
  @Response('session.revoke')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/revoke/:sessionId')
  async revoke(
    @Param('sessionId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    sessionId: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.sessionService.revoke(userId, sessionId, {
      ipAddress,
      userAgent,
      geoLocation,
    });
    return {};
  }
}
