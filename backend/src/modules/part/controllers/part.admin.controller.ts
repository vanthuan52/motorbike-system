import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartService } from '../services/part.services';
import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartDto } from '../dtos/part.dto';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  PartAdminCreateDoc,
  PartAdminDeleteDoc,
  PartAdminListDoc,
  PartAdminParamsIdDoc,
  PartAdminUpdateDoc,
  PartAdminUpdateStatusDoc,
  PartAdminGetDoc,
} from '../docs/part.admin.doc';
import { PartUtil } from '../utils/part.util';
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
  PART_DEFAULT_AVAILABLE_ORDER_BY,
  PART_DEFAULT_AVAILABLE_SEARCH,
  PART_DEFAULT_STATUS,
} from '../constants/part.list.constant';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';

@ApiTags('modules.admin.part')
@Controller({
  version: '1',
  path: '/part',
})
export class PartAdminController {
  constructor(
    private readonly partService: PartService,
    private readonly partUtil: PartUtil,
    private readonly paginationUtil: PaginationUtil
  ) {}

  @PartAdminListDoc()
  @ResponsePaging('part.list')
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
      availableSearch: PART_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: PART_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', PART_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @Query('partType') partTypeId: string,
    @Query('vehicleBrand') vehicleBrandId: string
  ): Promise<IResponsePagingReturn<PartListResponseDto>> {
    const result = await this.partService.getListOffset(
      pagination,
      status,
      partTypeId,
      vehicleBrandId
    );
    const mapped = this.partUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @PartAdminParamsIdDoc()
  @Response('part.get')
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
  ): Promise<IResponseReturn<PartGetFullResponseDto>> {
    const part = await this.partService.findOneWithRelationsById(id);
    const mapped = this.partUtil.mapGetPopulate(part);
    return { data: mapped };
  }

  @PartAdminCreateDoc()
  @Response('part.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: PartCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.partService.create(body);
    return { data: { id: created.id } };
  }

  @PartAdminUpdateDoc()
  @Response('part.update')
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
    @Body() body: PartUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.partService.update(id, body);
    return {};
  }

  @PartAdminUpdateStatusDoc()
  @Response('part.updateStatus')
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
    @Body() body: PartUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.partService.updateStatus(id, body);
    return {};
  }

  @PartAdminDeleteDoc()
  @Response('part.delete')
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
    await this.partService.delete(id);
    return {};
  }
}
