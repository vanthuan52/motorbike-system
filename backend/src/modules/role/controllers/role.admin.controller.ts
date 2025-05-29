import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { RoleAdminListDoc } from '../docs/role.admin.doc';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInBoolean,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  ROLE_DEFAULT_AVAIABLE_SEARCH,
  ROLE_DEFAULT_IS_ACTIVE,
  ROLE_DEFAULT_POLICY_ROLE_TYPE,
} from '../constants/role.list.constant';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { IResponsePaging } from '@/common/response/interfaces/response.interface';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { RoleDoc } from '../entities/role.entity';

@ApiTags('modules.admin.role')
@Controller({
  version: '1',
  path: '/role',
})
export class RoleAdminController {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly roleService: RoleService,
  ) {}

  @RoleAdminListDoc()
  @ResponsePaging('role.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({ availableSearch: ROLE_DEFAULT_AVAIABLE_SEARCH })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean('isActive', ROLE_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
    @PaginationQueryFilterInEnum(
      'type',
      ROLE_DEFAULT_POLICY_ROLE_TYPE,
      ENUM_POLICY_ROLE_TYPE,
    )
    type: Record<string, any>,
  ): Promise<IResponsePaging<RoleListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...isActive,
      ...type,
    };

    const roles: RoleDoc[] = await this.roleService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.roleService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);
    const mapRoles: RoleListResponseDto[] = this.roleService.mapList(roles);

    return {
      _pagination: { total, totalPage },
      data: mapRoles,
    };
  }
}
