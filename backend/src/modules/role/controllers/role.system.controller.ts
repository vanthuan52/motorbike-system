import { PaginationService } from '@/common/pagination/services/pagination.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { RoleSystemListDoc } from '../docs/role.system.doc';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  ROLE_DEFAULT_AVAIABLE_SEARCH,
  ROLE_DEFAULT_POLICY_ROLE_TYPE,
} from '../constants/role.list.constant';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';
import { IResponsePaging } from '@/common/response/interfaces/response.interface';
import { RoleShortResponseDto } from '../dtos/response/role.short.response.dto';
import { RoleDoc } from '../entities/role.entity';

@ApiTags('modules.system.role')
@Controller({
  version: '1',
  path: '/role',
})
export class RoleSystemController {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly roleService: RoleService,
  ) {}

  @RoleSystemListDoc()
  @ResponsePaging('role.list')
  @Get('/list')
  async list(
    @PaginationQuery({ availableSearch: ROLE_DEFAULT_AVAIABLE_SEARCH })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'type',
      ROLE_DEFAULT_POLICY_ROLE_TYPE,
      ENUM_POLICY_ROLE_TYPE,
    )
    type: Record<string, any>,
  ): Promise<IResponsePaging<RoleShortResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
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

    const mapRoles: RoleShortResponseDto[] = this.roleService.mapShort(roles);

    return {
      _pagination: { total, totalPage },
      data: mapRoles,
    };
  }
}
