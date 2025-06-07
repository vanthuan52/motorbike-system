import {
  Controller,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientSession } from 'mongoose';
import { UserService } from '../services/user.service';
import { DatabaseService } from '@/common/database/services/database.service';

import { MessageService } from '@/common/message/services/message.service';
import { SessionService } from '@/modules/session/services/session.service';
import { Response } from '@/common/response/decorators/response.decorator';
import { PolicyRoleProtected } from '@/modules/policy/decorators/policy.decorator';
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '../decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { UserParsePipe } from '../pipes/user.parse.pipe';
import { UserDoc } from '../entities/user.entity';
import { IDatabaseUpdateManyOptions } from '@/common/database/interfaces/database.interface';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { UserUserDeleteDoc } from '../docs/user.user.doc';

@ApiTags('modules.user.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserUserController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly sessionService: SessionService,
  ) {}

  @UserUserDeleteDoc()
  @Response('user.delete')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
  @UserProtected([false])
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/delete')
  async delete(
    @AuthJwtPayload('user', UserParsePipe) user: UserDoc,
  ): Promise<void> {
    const session: ClientSession =
      await this.databaseService.createTransaction();

    try {
      await this.userService.softDelete(user, {
        session,
        actionBy: user._id,
      });

      await this.sessionService.updateManyRevokeByUser(user._id, {
        session,
      } as IDatabaseUpdateManyOptions);

      await this.databaseService.commitTransaction(session);
    } catch (err: unknown) {
      await this.databaseService.abortTransaction(session);

      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }

    return;
  }
}
