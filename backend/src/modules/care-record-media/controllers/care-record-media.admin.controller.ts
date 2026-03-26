import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-record-media.list.constant';
import {
  CareRecordMediaAdminCreateDoc,
  CareRecordMediaAdminDeleteDoc,
  CareRecordMediaAdminListDoc,
  CareRecordMediaAdminParamsIdDoc,
  CareRecordMediaAdminUpdateDoc,
} from '../docs/care-record-media.admin.doc';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { CareRecordMediaGetFullResponseDto } from '../dtos/response/care-record-media.full.response.dto';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaService } from '../services/care-record-media.service';
import { CareRecordMediaUtil } from '../utils/care-record-media.util';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';

@ApiTags('modules.admin.care-record-media')
@Controller({
  version: '1',
  path: '/care-record-media',
})
export class CareRecordMediaAdminController {
  constructor(
    private readonly careRecordMediaService: CareRecordMediaService,
    private readonly careRecordMediaUtil: CareRecordMediaUtil,
    private readonly paginationUtil: PaginationUtil
  ) {}

  @CareRecordMediaAdminListDoc()
  @ResponsePaging('care-record-media.list')
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
      availableSearch: CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('careRecord', RequestOptionalParseObjectIdPipe)
    careRecordId: string
  ): Promise<IResponsePagingReturn<CareRecordMediaListResponseDto>> {
    const filters: Record<string, any> = {};

    if (careRecordId) {
      filters['careRecordId'] = careRecordId;
    }

    const result = await this.careRecordMediaService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.careRecordMediaUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareRecordMediaAdminParamsIdDoc()
  @Response('care-record-media.get')
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
  ): Promise<IResponseReturn<CareRecordMediaGetFullResponseDto>> {
    const careRecordMedia = await this.careRecordMediaService.findOneById(id);
    return {
      data: this.careRecordMediaUtil.mapGetFull(careRecordMedia),
    };
  }

  @CareRecordMediaAdminCreateDoc()
  @Response('care-record-media.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: CareRecordMediaCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordMediaService.create(body);
    return { data: { id: created.id } };
  }

  @CareRecordMediaAdminUpdateDoc()
  @Response('care-record-media.update')
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
    @Body() body: CareRecordMediaUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.careRecordMediaService.update(id, body);
    return {};
  }

  @CareRecordMediaAdminDeleteDoc()
  @Response('care-record-media.delete')
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
    await this.careRecordMediaService.delete(id);
    return {};
  }
}
