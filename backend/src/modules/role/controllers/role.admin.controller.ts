import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import {
  RoleAdminCreateDoc,
  RoleAdminDeleteDoc,
  RoleAdminGetDoc,
  RoleAdminListDoc,
  RoleAdminUpdateDoc,
} from '../docs/role.admin.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
  EnumRoleType,
} from '@/modules/policy/enums/policy.enum';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  ROLE_DEFAULT_AVAIABLE_SEARCH,
  RoleDefaultType,
} from '../constants/role.list.constant';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { RoleDoc } from '../entities/role.entity';
import { RoleDto } from '../dtos/role.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RoleCreateRequestDto } from '../dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from '../dtos/request/role.update.request.dto';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { RoleProtected } from '../decorators/role.decorator';
import { RoleUtil } from '../utils/role.util';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';

@ApiTags('modules.admin.role')
@Controller({
  version: '1',
  path: '/role',
})
export class RoleAdminController {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleUtil: RoleUtil,
  ) {}

  @RoleAdminListDoc()
  @ResponsePaging('role.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ROLE_DEFAULT_AVAIABLE_SEARCH,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum<EnumRoleType>('type', RoleDefaultType)
    type?: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<RoleListResponseDto>> {
    return this.roleService.getListOffset(pagination, type);
  }

  @RoleAdminGetDoc()
  @Response('role.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:roleId')
  async get(
    @Param('roleId', RequestRequiredPipe, RequestIsValidUuidPipe)
    roleId: string,
  ): Promise<IResponseReturn<RoleDto>> {
    return this.roleService.getOne(roleId);
  }

  @RoleAdminCreateDoc()
  @Response('role.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: RoleCreateRequestDto,
  ): Promise<IResponseReturn<RoleDto>> {
    return this.roleService.create(body);
  }

  @RoleAdminUpdateDoc()
  @Response('role.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:roleId')
  async update(
    @Param('roleId', RequestRequiredPipe, RequestIsValidUuidPipe)
    roleId: string,
    @Body() body: RoleUpdateRequestDto,
  ): Promise<IResponseReturn<RoleDto>> {
    return this.roleService.update(roleId, body);
  }

  @RoleAdminDeleteDoc()
  @Response('role.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:role')
  async delete(
    @Param('role', RequestRequiredPipe, RequestIsValidUuidPipe)
    role: RoleDoc,
  ): Promise<void> {
    await this.roleService.delete(role._id);

    return;
  }
}
