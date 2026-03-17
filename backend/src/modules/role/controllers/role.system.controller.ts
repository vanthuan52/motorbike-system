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
import { RoleListResponseDto } from '@/modules/role/dtos/response/role.list.response.dto';
import { RoleService } from '@/modules/role/services/role.service';
import { EnumRoleType } from '@/modules/policy/enums/policy.enum';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { RoleAbilitiesResponseDto } from '../dtos/response/role.abilities.response.dto';

@ApiTags('modules.system.role')
@Controller({
  version: '1',
  path: '/role',
})
export class RoleSystemController {
  constructor(private readonly roleService: RoleService) {}

  @RoleSystemListDoc()
  @ResponsePaging('role.list')
  @Get('/list')
  async list(
    @PaginationCursorQuery({
      availableSearch: RoleDefaultAvailableSearch,
    })
    pagination: IPaginationQueryCursorParams,
    @PaginationQueryFilterInEnum<EnumRoleType>('type', RoleDefaultType)
    type?: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<RoleListResponseDto>> {
    return this.roleService.getListCursor(pagination, type);
  }

  @RoleSystemGetAbilitiesDoc()
  @Response('role.getAbilities')
  @ApiKeySystemProtected()
  @Get('/get/:roleId/abilities')
  async getAbilities(
    @Param('roleId', RequestRequiredPipe, RequestIsValidUuidPipe)
    roleId: string,
  ): Promise<IResponseReturn<RoleAbilitiesResponseDto>> {
    return this.roleService.getAbilities(roleId);
  }
}
