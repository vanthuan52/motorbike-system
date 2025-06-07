import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientSession } from 'mongoose';
import { UserService } from '../services/user.service';
import { MessageService } from '@/common/message/services/message.service';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { AuthService } from '@/modules/auth/services/auth.service';
import { RoleService } from '@/modules/role/services/role.service';
import {
  UserAdminCreateDoc,
  UserAdminGetDoc,
  UserAdminListDoc,
  UserAdminUpdateDoc,
  UserAdminUpdateStatusDoc,
} from '../docs/user.admin.doc';
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
import { UserProtected } from '../decorators/user.decorator';
import { _ } from '@faker-js/faker/dist/airline-BUL6NtOJ';
import {
  PaginationQuery,
  PaginationQueryFilterIn,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_STATUS,
} from '../constants/user.list.contant';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_USER_SIGN_UP_FROM, ENUM_USER_STATUS } from '../enums/user.enum';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { UserListResponseDto } from '../dtos/response/user.list.response.dto';
import { IUserDoc, IUserEntity } from '../interfaces/user.interface';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { UserParsePipe } from '../pipes/user.parse.pipe';
import { UserDoc } from '../entities/user.entity';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { UserCreateRequestDto } from '../dtos/request/user.create.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '@/modules/role/enums/role.status-code.enum';
import { ENUM_USER_STATUS_CODE_ERROR } from '../enums/user.status-code.enum';
import { IAuthPassword } from '@/modules/auth/interfaces/auth.interface';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { IDatabaseCreateOptions } from '@/common/database/interfaces/database.interface';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { UserNotSelfPipe } from '../pipes/user.not-self.pipe';
import { UserUpdateRequestDto } from '../dtos/request/user.update.request.dto';
import { UserUpdateStatusRequestDto } from '../dtos/request/user.update-status.request.dto';

@ApiTags('modules.admin.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserAdminController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  @UserAdminListDoc()
  @ResponsePaging('user.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: USER_DEFAULT_AVAILABLE_SEARCH,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      USER_DEFAULT_STATUS,
      ENUM_USER_STATUS,
    )
    status: Record<string, any>,
    @PaginationQueryFilterIn('role') role: Record<string, any>,
  ): Promise<IResponsePaging<UserListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
      ...role,
    };

    const users: IUserEntity[] = await this.userService.findAllWithRole(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.userService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.userService.mapList(users);

    return {
      _pagination: { total, totalPage },
      data: mapped,
    };
  }

  @UserAdminGetDoc()
  @Response('user.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:user')
  async get(
    @Param('user', RequestRequiredPipe, UserParsePipe) user: UserDoc,
  ): Promise<IResponse<UserProfileResponseDto>> {
    const userWithRole: IUserDoc = await this.userService.join(user);
    const mapped: UserProfileResponseDto =
      this.userService.mapProfile(userWithRole);

    return { data: mapped };
  }

  @UserAdminCreateDoc()
  @Response('user.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() { email, role, name }: UserCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.roleService.findOneById(role),
      this.userService.existByEmail(email),
    ];

    const [checkRole, emailExist] = await Promise.all(promises);

    if (!checkRole) {
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

    const passwordString = this.authService.createDefaultPassword();
    const password: IAuthPassword = this.authService.createPassword(
      passwordString,
      {
        temporary: true,
      },
    );

    const session: ClientSession =
      await this.databaseService.createTransaction();

    try {
      const created = await this.userService.create(
        {
          email,
          name,
          role,
        },
        password,
        ENUM_USER_SIGN_UP_FROM.ADMIN,
        { session, actionBy: createdBy } as IDatabaseCreateOptions,
      );

      await this.databaseService.commitTransaction(session);

      return {
        data: { _id: created._id },
      };
    } catch (err: unknown) {
      await this.databaseService.abortTransaction(session);

      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @UserAdminUpdateDoc()
  @Response('user.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:user')
  async update(
    @Param('user', RequestRequiredPipe, UserParsePipe, UserNotSelfPipe)
    user: UserDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { name, role, phone }: UserUpdateRequestDto,
  ): Promise<void> {
    const checkRole = await this.roleService.findOneActiveById(role);
    if (!checkRole) {
      throw new NotFoundException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'role.error.notFound',
      });
    }

    const session: ClientSession =
      await this.databaseService.createTransaction();

    try {
      await this.userService.update(
        user,
        { name, role, phone },
        { session, actionBy: updatedBy },
      );

      await this.databaseService.commitTransaction(session);
    } catch (err: unknown) {
      await this.databaseService.abortTransaction(session);

      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @UserAdminUpdateStatusDoc()
  @Response('user.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Patch('/update/:user/status')
  async updateStatus(
    @Param('user', RequestRequiredPipe, UserParsePipe, UserNotSelfPipe)
    user: UserDoc,
    @AuthJwtPayload('user') actionBy: string,
    @Body() { status }: UserUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    if (user.status === ENUM_USER_STATUS.BLOCKED) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.STATUS_INVALID,
        message: 'user.error.statusInvalid',
        _metadata: {
          customProperty: {
            messageProperties: {
              status: status.toLowerCase(),
            },
          },
        },
      });
    }

    const session: ClientSession =
      await this.databaseService.createTransaction();

    try {
      await this.userService.updateStatus(
        user,
        { status },
        { session, actionBy },
      );

      await this.databaseService.commitTransaction(session);

      return {
        _metadata: {
          customProperty: {
            messageProperties: {
              status: status.toLowerCase(),
            },
          },
        },
      };
    } catch (err: unknown) {
      await this.databaseService.abortTransaction(session);

      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }
}
