import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { MessageService } from '@/common/message/services/message.service';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { AuthService } from '@/modules/auth/services/auth.service';
import { RoleService } from '@/modules/role/services/role.service';
import { UserAdminListDoc } from '../docs/user.admin.doc';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
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
import { IResponsePaging } from '@/common/response/interfaces/response.interface';
import { UserListResponseDto } from '../dtos/response/user.list.response.dto';
import { IUserEntity } from '../interfaces/user.interface';

@ApiTags('modules.admin.user')
@Controller({
  version: '1',
  path: '/users',
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
}
