import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_POLICY_ROLE_TYPE,
  USER_DEFAULT_STATUS,
} from '../constants/user.list.contant';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_USER_STATUS } from '../enums/user.enum';
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
    @PaginationQueryFilterInEnum(
      'role.type',
      USER_DEFAULT_POLICY_ROLE_TYPE,
      ENUM_POLICY_ROLE_TYPE,
      {
        queryField: 'roleType',
      },
    )
    roleType: Record<string, any>,
  ): Promise<IResponsePaging<UserListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
      ...roleType,
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

    const passwordString = this.authService.createPasswordRandom();
    const password: IAuthPassword = this.authService.createPassword(
      passwordString,
      {
        temporary: true,
      },
    );

    // to do

    return {
      data: { _id: 'id' },
    };
  }
}
