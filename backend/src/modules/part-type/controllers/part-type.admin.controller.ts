import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartTypeService } from '../services/part-type.services';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PartTypeDto } from '../dtos/part-type.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  PartTypeAdminCreateDoc,
  PartTypeAdminDeleteDoc,
  PartTypeAdminGetDoc,
  PartTypeAdminListDoc,
  PartTypeAdminUpdateDoc,
  PartTypeAdminUpdateStatusDoc,
} from '../docs/part-type.admin.doc';
import { PartTypeUtil } from '../utils/part-type.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  PART_TYPE_DEFAULT_AVAILABLE_ORDER_BY,
  PART_TYPE_DEFAULT_AVAILABLE_SEARCH,
  PART_TYPE_DEFAULT_STATUS,
} from '../constants/part-type.list.constant';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';

@ApiTags('modules.admin.part-type')
@Controller({
  version: '1',
  path: '/part-type',
})
export class PartTypeAdminController {
  constructor(
    private readonly partTypeService: PartTypeService,
    private readonly partTypeUtil: PartTypeUtil,
    private readonly paginationUtil: PaginationUtil
  ) {}

  @PartTypeAdminListDoc()
  @ResponsePaging('part-type.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: PART_TYPE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: PART_TYPE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', PART_TYPE_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<PartTypeListResponseDto>> {
    const result = await this.partTypeService.getListOffset(
      pagination,
      status
    );
    const mapped = this.partTypeUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @PartTypeAdminGetDoc()
  @Response('part-type.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<PartTypeDto>> {
    const partType = await this.partTypeService.findOneById(id);
    const mapped = this.partTypeUtil.mapOne(partType);
    return { data: mapped };
  }

  @PartTypeAdminCreateDoc()
  @Response('part-type.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: PartTypeCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.partTypeService.create(body);
    return { data: { id: created.id } };
  }

  @PartTypeAdminUpdateDoc()
  @Response('part-type.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: PartTypeUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.partTypeService.update(id, body);
    return {};
  }

  @PartTypeAdminUpdateStatusDoc()
  @Response('part-type.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: PartTypeUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.partTypeService.updateStatus(id, body);
    return {};
  }

  @PartTypeAdminDeleteDoc()
  @Response('part-type.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<void>> {
    await this.partTypeService.delete(id);
    return {};
  }
}
