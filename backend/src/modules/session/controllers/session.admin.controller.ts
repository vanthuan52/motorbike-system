import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionService } from '../services/session.service';
import {
  SessionAdminListDoc,
  SessionAdminRevokeDoc,
} from '../docs/session.admin.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { UserParsePipe } from '@/modules/user/pipes/user.parse.pipe';
import { UserDoc } from '@/modules/user/entities/user.entity';
import { PaginationQuery } from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { IResponsePaging } from '@/common/response/interfaces/response.interface';
import { SessionListResponseDto } from '../dtos/response/session.list.response.dto';
import { SessionDoc } from '../entities/session.entity';
import { UserNotSelfPipe } from '@/modules/user/pipes/user.not-self.pipe';
import { SessionActiveParsePipe } from '../pipes/session.parse.pipe';
import { ENUM_SESSION_STATUS_CODE_ERROR } from '../enums/session.status-code.enum';

@ApiTags('modules.admin.session')
@Controller({
  version: '1',
  path: '/session/:user',
})
export class SessionAdminController {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly sessionService: SessionService,
  ) {}

  @SessionAdminListDoc()
  @ResponsePaging('session.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.SESSION,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @Param('user', RequestRequiredPipe, UserParsePipe) user: UserDoc,
    @PaginationQuery() { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging<SessionListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    const sessions: SessionDoc[] = await this.sessionService.findAllByUser(
      user._id,
      find,
      {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      },
    );
    const total: number = await this.sessionService.getTotalByUser(
      user._id,
      find,
    );
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.sessionService.mapList(sessions);

    return {
      _pagination: { total, totalPage },
      data: mapped,
    };
  }

  @SessionAdminRevokeDoc()
  @Response('session.revoke')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/revoke/:session')
  async revoke(
    @Param('user', RequestRequiredPipe, UserParsePipe, UserNotSelfPipe)
    user: UserDoc,
    @Param('session', RequestRequiredPipe, SessionActiveParsePipe)
    session: SessionDoc,
  ): Promise<void> {
    if (user._id !== session.user) {
      throw new NotFoundException({
        statusCode: ENUM_SESSION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'session.error.notFound',
      });
    }

    await this.sessionService.updateRevoke(session);
  }
}
