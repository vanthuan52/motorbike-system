import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from '@/modules/user/services/user.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from '@/common/message/services/message.service';
import { AuthLoginRequestDto } from '../dtos/request/auth.login.request.dto';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { AuthLoginResponseDto } from '../dtos/response/auth.login.response.dto';
import { UserDoc } from '@/modules/user/entities/user.entity';
import {
  AuthPublicLoginCredentialDoc,
  AuthPublicSignUpDoc,
} from '../docs/auth.public.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { ENUM_USER_STATUS_CODE_ERROR } from '@/modules/user/enums/user.status-code.enum';
import { ENUM_USER_STATUS } from '@/modules/user/enums/user.enum';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '@/modules/role/enums/role.status-code.enum';
import { SessionService } from '@/modules/session/services/session.service';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { AuthSignUpRequestDto } from '../dtos/request/auth.sign-up.request.dto';
import { RoleService } from '@/modules/role/services/role.service';

@ApiTags('modules.public.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthPublicController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly sessionService: SessionService,
  ) {}

  @AuthPublicLoginCredentialDoc()
  @Response('auth.loginWithCredential')
  //@ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/login/credential')
  async loginWithCredential(
    @Body() { email, password }: AuthLoginRequestDto,
    @Req() request: IRequestApp,
  ): Promise<IResponse<AuthLoginResponseDto>> {
    let user: UserDoc | null = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const validate: boolean = this.authService.validateUser(
      password,
      user.password,
    );

    if (!validate) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.PASSWORD_NOT_MATCH,
        message: 'auth.error.passwordNotMatch',
      });
    } else if (user.status !== ENUM_USER_STATUS.ACTIVE) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
        message: 'user.error.inactive',
      });
    }

    const userWithRole: IUserDoc = await this.userService.join(user);
    if (!userWithRole.role.isActive) {
      throw new ForbiddenException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
        message: 'role.error.inactive',
      });
    }

    try {
      const session = await this.sessionService.create(request, {
        user: user._id,
      });

      await this.sessionService.setLoginSession(userWithRole, session);

      const token = this.authService.createToken(userWithRole, session._id);

      return {
        data: token,
      };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @AuthPublicSignUpDoc()
  @Response('auth.signUp')
  //@ApiKeyProtected()
  @Post('/sign-up')
  async signUp(
    @Body()
    { email, name, password: passwordString, phone }: AuthSignUpRequestDto,
  ): Promise<void> {
    const promises: Promise<any>[] = [
      this.roleService.findOneByName('user'),
      this.userService.existByEmail(email),
    ];

    const [role, emailExist] = await Promise.all(promises);

    if (!role) {
      throw new NotFoundException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'role.error.notFound',
      });
    } else if (emailExist) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.EMAIL_EXIST,
        message: 'user.error.emailExist',
      });
    }

    const password = this.authService.createPassword(passwordString);

    try {
      await this.userService.signUp(
        role._id,
        {
          email,
          name,
          password: passwordString,
          phone,
        },
        password,
      );
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }
}
