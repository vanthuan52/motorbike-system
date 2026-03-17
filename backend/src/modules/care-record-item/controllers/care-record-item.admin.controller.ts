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
import { CareRecordItemService } from '../services/care-record-item.service';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordItemListResponseDto } from '../dtos/response/care-record-item.list.response.dto';
import { CareRecordItemGetFullResponseDto } from '../dtos/response/care-record-item.full.response.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  CareRecordItemCreateDoc,
  CareRecordItemDeleteDoc,
  CareRecordItemAdminListDoc,
  CareRecordItemParamsIdDoc,
  CareRecordItemUpdateDoc,
  CareRecordItemUpdateApprovalDoc,
} from '../docs/care-record-item.admin.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  CARE_RECORD_ITEM_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_ITEM_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-record-item.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { RequestOptionalParseUUIDPipe } from '@/common/request/pipes/request.optional-parse-uuid.pipe';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CareRecordItemUtil } from '../utils/care-record-item.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

@ApiTags('modules.admin.care-record-item')
@Controller({
  version: '1',
  path: '/care-record-item',
})
export class CareRecordItemAdminController {
  constructor(
    private readonly careRecordItemService: CareRecordItemService,
    private readonly careRecordItemUtil: CareRecordItemUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @CareRecordItemAdminListDoc()
  @ResponsePaging('care-record-item.list')
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
      availableSearch: CARE_RECORD_ITEM_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_ITEM_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('careRecord', RequestOptionalParseUUIDPipe)
    careRecordId: string,
  ): Promise<IResponsePagingReturn<CareRecordItemListResponseDto>> {
    const filters: Record<string, any> = {};

    if (careRecordId) {
      filters['careRecord._id'] = careRecordId;
    }

    const { data, total } = await this.careRecordItemService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.careRecordItemUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @CareRecordItemParamsIdDoc()
  @Response('care-record-item.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<CareRecordItemGetFullResponseDto>> {
    const careRecordItem = await this.careRecordItemService.findOneById(id);
    const mapped = this.careRecordItemUtil.mapGetFull(careRecordItem);
    return { data: mapped };
  }

  @CareRecordItemCreateDoc()
  @Response('care-record-item.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: CareRecordItemCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordItemService.create(body);
    return { data: { _id: created._id } };
  }

  @CareRecordItemUpdateDoc()
  @Response('care-record-item.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @Body() body: CareRecordItemUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordItemService.update(id, body);
    return {};
  }

  @CareRecordItemUpdateApprovalDoc()
  @Response('care-record-item.updateApproval')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/approval')
  async updateApproval(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @Body() body: CareRecordItemUpdateApprovalRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordItemService.updateApproval(id, body);
    return {};
  }

  @CareRecordItemDeleteDoc()
  @Response('care-record-item.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordItemService.delete(id);
    return {};
  }
}
