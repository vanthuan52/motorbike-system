import {
  Controller,
  InternalServerErrorException,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UserService } from '@/modules/user/services/user.service';
import { Response } from '@/common/response/decorators/response.decorator';
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
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '../decorators/auth.jwt.decorator';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { UserParsePipe } from '@/modules/user/pipes/user.parse.pipe';
import { UserNotSelfPipe } from '@/modules/user/pipes/user.not-self.pipe';
import { UserDoc } from '@/modules/user/entities/user.entity';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import { AuthAdminUpdatePasswordDoc } from '../docs/auth.admin.doc';

@ApiTags('modules.admin.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthAdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @AuthAdminUpdatePasswordDoc()
  @Response('auth.updatePassword')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.AUTH,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:user/password')
  async updatePassword(
    @AuthJwtPayload('user') updatedBy: string,
    @Param('user', RequestRequiredPipe, UserParsePipe, UserNotSelfPipe)
    user: UserDoc,
  ): Promise<void> {
    try {
      const passwordString = this.authService.createDefaultPassword();
      const password = this.authService.createPassword(passwordString, {
        temporary: true,
      });

      await this.userService.updatePassword(user, password, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
      return;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }
}
