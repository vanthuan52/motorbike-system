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
import { RoleAbilitiesResponseDto } from '@/modules/role/dtos/response/role.abilities.response.dto';
import { RoleListResponseDto } from '@/modules/role/dtos/response/role.list.response.dto';
import { EnumRoleType, Prisma } from '@/generated/prisma-client';
import { PermissionService } from '../services/permission.service';

@ApiTags('modules.system.permission')
@Controller({
  version: '1',
  path: '/permission',
})
export class PermissionSystemController {
  constructor(private readonly permissionService: PermissionService) {}

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
    @PaginationQueryFilterInEnum<EnumRoleType>('type', RoleDefaultType)
    type?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<RoleListResponseDto>> {
    return this.permissionService.getListCursor(pagination, type);
  }
}
