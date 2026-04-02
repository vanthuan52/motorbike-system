import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  PaginationCursorQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationIn,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { ApiKeySystemProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  RoleDefaultAvailableSearch,
  RoleDefaultType,
} from '@/modules/role/constants/role.list.constant';
import {
  RoleSystemGetAbilitiesDoc,
  RoleSystemListDoc,
} from '@/modules/role/docs/role.system.doc';
import { RolePermissionsResponseDto } from '@/modules/role/dtos/response/role.abilities.response.dto';
import { RoleListResponseDto } from '@/modules/role/dtos/response/role.list.response.dto';
import { RoleService } from '@/modules/role/services/role.service';
import { RoleUtil } from '@/modules/role/utils/role.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.system.role')
@Controller({
  version: '1',
  path: '/role',
})
export class RoleSystemController {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleUtil: RoleUtil
  ) {}

  @RoleSystemListDoc()
  @ResponsePaging('role.list')
  @ApiKeySystemProtected()
  @Get('/list')
  async list(
    @PaginationCursorQuery({
      availableSearch: RoleDefaultAvailableSearch,
    })
    pagination: IPaginationQueryCursorParams<
      Prisma.RoleSelect,
      Prisma.RoleWhereInput
    >,
    @PaginationQueryFilterInEnum('type', RoleDefaultType)
    type?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<RoleListResponseDto>> {
    const result = await this.roleService.getListCursor(pagination, {
      ...type,
    });
    const mapped = this.roleUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @RoleSystemGetAbilitiesDoc()
  @Response('role.getPermissions')
  @ApiKeySystemProtected()
  @Get('/get/:roleId/permissions')
  async getPermissions(
    @Param('roleId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    roleId: string
  ): Promise<IResponseReturn<RolePermissionsResponseDto>> {
    const permissions = await this.roleService.getPermissions(roleId);
    return { data: { permissions: permissions as any } };
  }
}
