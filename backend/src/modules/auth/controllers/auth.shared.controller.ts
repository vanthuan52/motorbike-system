import {
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { SessionService } from '@/modules/session/services/session.service';
import { MessageService } from '@/common/message/services/message.service';
import { UserService } from '@/modules/user/services/user.service';
import { AuthSharedRefreshDoc } from '../docs/auth.shared.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtPayload,
  AuthJwtRefreshProtected,
  AuthJwtToken,
} from '../decorators/auth.jwt.decorator';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { IAuthJwtRefreshTokenPayload } from '../interfaces/auth.interface';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { AuthRefreshResponseDto } from '../dtos/response/auth.refresh.response.dto';
import { ENUM_SESSION_STATUS_CODE_ERROR } from '@/modules/session/enums/session.status-code.enum';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from '@/modules/user/enums/user.status-code.enum';

@ApiTags('modules.shared.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthSharedController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly messageService: MessageService,
  ) {}

  @AuthSharedRefreshDoc()
  @Response('auth.refresh')
  @UserProtected()
  @AuthJwtRefreshProtected()
  //@ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @AuthJwtToken() refreshToken: string,
    @AuthJwtPayload<IAuthJwtRefreshTokenPayload>()
    { user: userFromPayload, session }: IAuthJwtRefreshTokenPayload,
  ): Promise<IResponse<AuthRefreshResponseDto>> {
    const checkActive = await this.sessionService.findLoginSession(session);
    if (!checkActive) {
      throw new UnauthorizedException({
        statusCode: ENUM_SESSION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'session.error.notFound',
      });
    }

    const user: IUserDoc | null =
      await this.userService.findOneActiveById(userFromPayload);
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }
    const token = this.authService.refreshToken(user, refreshToken);
    return {
      data: token,
    };
  }
}
