import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationService } from '@/common/pagination/services/pagination.service';

import { SessionService } from '../services/session.service';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { PaginationQuery } from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { IResponsePaging } from '@/common/response/interfaces/response.interface';
import { SessionListResponseDto } from '../dtos/response/session.list.response.dto';
import { SessionDoc } from '../entities/session.entity';
import {
  SessionSharedListDoc,
  SessionSharedRevokeDoc,
} from '../docs/session.shared.doc';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { SessionActiveByUserParsePipe } from '../pipes/session.parse.pipe';
import { ENUM_SESSION_STATUS_CODE_ERROR } from '../enums/session.status-code.enum';

@ApiTags('nodules.shared.session')
@Controller({
  version: '1',
  path: '/session',
})
export class SessionSharedController {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly sessionService: SessionService,
  ) {}

  @SessionSharedListDoc()
  @ResponsePaging('session.list')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @AuthJwtPayload('user') user: string,
    @PaginationQuery()
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging<SessionListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    const sessions: SessionDoc[] = await this.sessionService.findAllByUser(
      user,
      find,
      {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      },
    );
    const total: number = await this.sessionService.getTotalByUser(user, find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.sessionService.mapList(sessions);

    return {
      _pagination: { total, totalPage },
      data: mapped,
    };
  }

  @SessionSharedRevokeDoc()
  @Response('session.revoke')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/revoke/:session')
  async revoke(
    @Param('session', RequestRequiredPipe, SessionActiveByUserParsePipe)
    session: SessionDoc,
    @AuthJwtPayload('session') sessionFromRequest: string,
  ): Promise<void> {
    if (session._id === sessionFromRequest) {
      throw new ForbiddenException({
        statusCode: ENUM_SESSION_STATUS_CODE_ERROR.FORBIDDEN_REVOKE,
        message: 'session.error.forbiddenRevoke',
      });
    }

    await this.sessionService.updateRevoke(session);
  }
}
