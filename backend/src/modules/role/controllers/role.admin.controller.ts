import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import {
  RoleAdminCreateDoc,
  RoleAdminDeleteDoc,
  RoleAdminGetDoc,
  RoleAdminInactiveDoc,
  RoleAdminListDoc,
  RoleAdminUpdateDoc,
} from '../docs/role.admin.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
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
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { RoleDoc } from '../entities/role.entity';
import { RoleParsePipe } from '../pipes/role.parse.pipe';
import { RoleGetResponseDto } from '../dtos/response/role.get.response.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RoleCreateRequestDto } from '../dtos/request/role.create.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../enums/role.status-code.enum';
import { RoleUpdateRequestDto } from '../dtos/request/role.update.request.dto';
import { RoleIsActivePipe } from '../pipes/role.is-active.pipe';
import { RoleIsUsedPipe } from '../pipes/role.is-used.pipe';

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

  @RoleAdminGetDoc()
  @Response('role.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:role')
  async get(
    @Param('role', RequestRequiredPipe, RoleParsePipe) role: RoleDoc,
  ): Promise<IResponse<RoleGetResponseDto>> {
    const mapRole: RoleGetResponseDto = this.roleService.mapGet(role);

    return { data: mapRole };
  }

  @RoleAdminCreateDoc()
  @Response('role.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() { name, description, type, permissions }: RoleCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const exist: boolean = await this.roleService.existByName(name);
    if (exist) {
      throw new ConflictException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.EXIST,
        message: 'role.error.exist',
      });
    }

    const create = await this.roleService.create({
      name,
      description,
      type,
      permissions,
    });

    return {
      data: { _id: create.id },
    };
  }

  @RoleAdminUpdateDoc()
  @Response('role.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:role')
  async update(
    @Param('role', RequestRequiredPipe, RoleParsePipe) role: RoleDoc,
    @Body() { description, permissions, type }: RoleUpdateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    await this.roleService.update(role as RoleDoc, {
      description,
      permissions,
      type,
    });

    return {
      data: { _id: role._id },
    };
  }

  @RoleAdminInactiveDoc()
  @Response('role.inactive')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:role/inactive')
  async inactive(
    @Param(
      'role',
      RequestRequiredPipe,
      RoleParsePipe,
      new RoleIsActivePipe([true]),
    )
    role: RoleDoc,
  ): Promise<void> {
    await this.roleService.inactive(role);

    return;
  }

  @RoleAdminInactiveDoc()
  @Response('role.inactive')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:role/active')
  async active(
    @Param(
      'role',
      RequestRequiredPipe,
      RoleParsePipe,
      new RoleIsActivePipe([false]),
    )
    role: RoleDoc,
  ): Promise<void> {
    await this.roleService.active(role);

    return;
  }

  @RoleAdminDeleteDoc()
  @Response('role.delete')
  // @PolicyAbilityProtected({
  //   subject: ENUM_POLICY_SUBJECT.ROLE,
  //   action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
  // })
  // @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  // @UserProtected()
  // @AuthJwtAccessProtected()
  @Delete('/delete/:role')
  async delete(
    @Param('role', RequestRequiredPipe, RoleParsePipe, RoleIsUsedPipe)
    role: RoleDoc,
  ): Promise<void> {
    await this.roleService.delete(role);

    return;
  }
}
