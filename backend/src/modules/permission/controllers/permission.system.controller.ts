import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  PaginationCursorQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationIn,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { ApiKeySystemProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  RoleDefaultAvailableSearch,
  RoleDefaultType,
} from '@/modules/role/constants/role.list.constant';
import {
  RoleSystemListDoc,
} from '@/modules/role/docs/role.system.doc';
import { PermissionListResponseDto } from '@/modules/permission/dtos/response/permission.list.response.dto';
import { PermissionService } from '../services/permission.service';
import { PermissionUtil } from '../utils/permission.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.system.permission')
@Controller({
  version: '1',
  path: '/permission',
})
export class PermissionSystemController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly permissionUtil: PermissionUtil
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
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    @PaginationQueryFilterInEnum('type', RoleDefaultType)
    type?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<PermissionListResponseDto>> {
    const result = await this.permissionService.getListCursor(pagination, {
      ...type,
    });
    const mapped = this.permissionUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }
}
